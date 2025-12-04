"use client";

/**
 * Hand tracking controller using MediaPipe Hands
 * Detects hand gestures and updates shared state for particle interaction
 * @module components/hand-tracking/HandController
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useResponsive } from "@/app/hooks/useWindowSize";
import { sharedState } from "@/app/lib/sharedState";
import {
  type GestureDirection,
  type Hands,
  type HandsResults,
  type NormalizedLandmark,
  GESTURE_CONSTANTS,
  TRACKING_CONSTANTS,
  MEDIAPIPE_CDN,
} from "@/app/lib/constants";

/**
 * Component props
 */
interface HandControllerProps {
  /**
   * Callback fired when swipe gesture is detected
   */
  onGesture: (direction: GestureDirection) => void;
  /**
   * Show loading indicator
   * @default true
   */
  showLoadingIndicator?: boolean;
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  /**
   * Optional error handler
   */
  onError?: (error: Error) => void;
}

/**
 * MediaPipe detection confidence thresholds
 */
const DETECTION_THRESHOLDS = {
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
} as const;

/**
 * MediaPipe hand landmark indices
 */
const LANDMARK_INDICES = {
  WRIST: 0,
  THUMB_TIP: 4,
  INDEX_TIP: 8,
} as const;

/**
 * Calculate Euclidean distance between two landmarks
 *
 * @param a - First landmark
 * @param b - Second landmark
 * @returns Distance value
 */
const calculateDistance = (
  a: NormalizedLandmark,
  b: NormalizedLandmark,
): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Normalize pinch distance to 0-1.5 range
 *
 * @param rawDistance - Raw distance between thumb and index
 * @returns Normalized distance with bounds
 */
const normalizePinchDistance = (rawDistance: number): number => {
  const normalized =
    (rawDistance - GESTURE_CONSTANTS.PINCH_MIN_DISTANCE) *
    GESTURE_CONSTANTS.PINCH_SCALE_FACTOR;
  return Math.max(0, Math.min(GESTURE_CONSTANTS.PINCH_MAX_VALUE, normalized));
};

/**
 * Load external script dynamically
 * Checks if script already exists to prevent duplicates
 *
 * @param src - Script URL
 * @returns Promise that resolves when loaded
 */
const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${src}"]`,
    );
    if (existing) {
      resolve();
      return;
    }

    // Create and append script
    const script = document.createElement("script");
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
};

/**
 * HandController Component
 *
 * Manages webcam access, MediaPipe Hands initialization, and gesture detection.
 * Updates shared state for particle system interaction.
 *
 * Detected Gestures:
 * - Pinch: Thumb-index distance controls particle expansion/compression
 * - Swipe: Horizontal hand movement switches between shapes
 * - Hand Position: X coordinate controls particle color hue
 *
 * Features:
 * - Automatic MediaPipe library loading from CDN
 * - Responsive camera resolution
 * - Gesture cooldown to prevent spam
 * - Smooth state updates with lerp
 * - Proper cleanup on unmount
 * - Error handling with optional callback
 *
 * @example
 * ```
 * <HandController
 *   onGesture={(dir) => handleShapeChange(dir)}
 *   onError={(err) => console.error(err)}
 * />
 * ```
 */
export const HandController: React.FC<HandControllerProps> = ({
  onGesture,
  showLoadingIndicator = true,
  loadingMessage = "Initializing Vision Models...",
  onError,
}) => {
  const [, config] = useResponsive();

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number | null>(null);
  const lastXRef = useRef<number | null>(null);
  const lastSwipeTimeRef = useRef<number>(0);

  // State
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  /**
   * Setup webcam with responsive resolution
   * Memoized because it's passed to init function
   */
  const setupCamera = useCallback(
    async (videoElement: HTMLVideoElement): Promise<void> => {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Browser API navigator.mediaDevices.getUserMedia not available",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: config.cameraWidth,
          height: config.cameraHeight,
          facingMode: "user",
        },
        audio: false,
      });

      videoElement.srcObject = stream;

      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        videoElement.onloadedmetadata = () => {
          void videoElement.play();
          resolve();
        };
      });
    },
    [config.cameraWidth, config.cameraHeight],
  );

  /**
   * Process hand detection results
   * Memoized because it's called from detectFrame
   */
  const processResults = useCallback(
    (results: HandsResults, isRunning: boolean): void => {
      if (!isRunning) return;

      const landmarksList = results.multiHandLandmarks;

      if (landmarksList && landmarksList.length > 0) {
        // Hand detected
        sharedState.handDetected = true;
        const landmarks = landmarksList[0];

        // Process wrist position for swipe detection
        const wrist = landmarks[LANDMARK_INDICES.WRIST];
        const now = Date.now();
        const currentX = 1 - wrist.x; // Invert X for natural movement

        // Detect swipe gesture
        if (lastXRef.current !== null) {
          const deltaX = currentX - lastXRef.current;
          const timeSinceLastSwipe = now - lastSwipeTimeRef.current;

          if (timeSinceLastSwipe > GESTURE_CONSTANTS.SWIPE_COOLDOWN) {
            if (deltaX > GESTURE_CONSTANTS.SWIPE_THRESHOLD) {
              onGesture("next");
              lastSwipeTimeRef.current = now;
            } else if (deltaX < -GESTURE_CONSTANTS.SWIPE_THRESHOLD) {
              onGesture("prev");
              lastSwipeTimeRef.current = now;
            }
          }
        }
        lastXRef.current = currentX;

        // Calculate pinch distance
        const thumb = landmarks[LANDMARK_INDICES.THUMB_TIP];
        const index = landmarks[LANDMARK_INDICES.INDEX_TIP];
        const distance = calculateDistance(thumb, index);
        const normalizedDistance = normalizePinchDistance(distance);

        // Smooth update to shared state
        sharedState.pinchDistance +=
          (normalizedDistance - sharedState.pinchDistance) *
          TRACKING_CONSTANTS.PINCH_LERP_ACTIVE;
        sharedState.handX +=
          (currentX - sharedState.handX) * TRACKING_CONSTANTS.HAND_X_LERP;
      } else {
        // No hand detected - reset state
        sharedState.handDetected = false;
        sharedState.pinchDistance +=
          (1.0 - sharedState.pinchDistance) *
          TRACKING_CONSTANTS.PINCH_LERP_INACTIVE;
        lastXRef.current = null;
      }
    },
    [onGesture],
  );

  /**
   * Initialize MediaPipe and start detection
   * ✅ FIX: detectFrame kept as regular function inside useEffect
   * This avoids circular dependency issues with useCallback
   */
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    let hands: Hands | null = null;
    const isRunning = { current: true };

    /**
     * Recursive detection frame loop
     * ✅ NOT wrapped in useCallback - only used internally
     */
    const detectFrame = async (
      handsInstance: Hands,
      video: HTMLVideoElement,
      running: { current: boolean },
    ): Promise<void> => {
      if (!running.current || !video) return;

      try {
        // Send frame to MediaPipe if video is ready
        if (video.readyState >= 2) {
          await handsInstance.send({ image: video });
        }
      } catch (error) {
        // Ignore errors during cleanup
        if (running.current && onError) {
          onError(error as Error);
        }
      }

      // Schedule next frame
      if (running.current) {
        requestRef.current = requestAnimationFrame(() => {
          void detectFrame(handsInstance, video, running);
        });
      }
    };

    const init = async (): Promise<void> => {
      try {
        // Load MediaPipe library
        await loadScript(MEDIAPIPE_CDN.HANDS_JS);

        // Setup camera
        await setupCamera(videoElement);

        // Initialize MediaPipe Hands
        const HandsConstructor = window.Hands;
        hands = new HandsConstructor({
          locateFile: (file: string) => `${MEDIAPIPE_CDN.BASE_URL}${file}`,
        });

        // Configure detection options
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: config.modelComplexity,
          minDetectionConfidence: DETECTION_THRESHOLDS.minDetectionConfidence,
          minTrackingConfidence: DETECTION_THRESHOLDS.minTrackingConfidence,
        });

        // Set results callback
        hands.onResults((results: HandsResults) => {
          processResults(results, isRunning.current);
        });

        setIsLoaded(true);

        // Start detection loop
        void detectFrame(hands, videoElement, isRunning);
      } catch (error) {
        console.error("HandController init failed:", error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    void init();

    // Cleanup function
    return () => {
      isRunning.current = false;

      // Cancel animation frame
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }

      // Stop camera stream
      if (videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
      }

      // Close MediaPipe instance
      if (hands) {
        setTimeout(() => {
          try {
            hands?.close();
          } catch {
            // Ignore cleanup errors
          }
        }, 100);
      }
    };
  }, [config.modelComplexity, setupCamera, processResults, onError]);

  return (
    <>
      {/* Loading Indicator */}
      {!isLoaded && showLoadingIndicator && (
        <div
          style={{
            position: "absolute",
            bottom: "clamp(15px, 3vh, 20px)",
            left: "clamp(15px, 3vw, 20px)",
            color: "#00ffcc",
            fontFamily: "'Outfit', sans-serif",
            zIndex: 5,
            fontSize: "clamp(0.7rem, 2vw, 0.9rem)",
            letterSpacing: "1px",
          }}
          role="status"
          aria-live="polite"
        >
          {loadingMessage}
        </div>
      )}

      {/* Hidden video element for MediaPipe processing */}
      <video
        ref={videoRef}
        style={{ display: "none" }}
        playsInline
        muted
        aria-hidden="true"
      />
    </>
  );
};

export default HandController;
