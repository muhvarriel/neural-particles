/**
 * Type definitions, interfaces, and constants for Neural Particles
 * @module lib/constants
 */

// ==================== SHAPE TYPES ====================

/**
 * Available particle formation shapes
 */
export type ShapeType = "heart" | "sphere" | "flower" | "spiral";

/**
 * All available shapes as a constant array
 */
export const SHAPES: readonly ShapeType[] = [
  "heart",
  "sphere",
  "flower",
  "spiral",
] as const;

// ==================== WINDOW & RESPONSIVE ====================

/**
 * Window size information with device categorization
 */
export interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
}

/**
 * Responsive configuration for particle system and camera
 */
export interface ResponsiveConfig {
  particleCount: number;
  particleSize: number;
  cameraWidth: number;
  cameraHeight: number;
  modelComplexity: 0 | 1;
  cameraPosition: [number, number, number];
  cameraFov: number;
  autoRotate: boolean;
}

// ==================== MEDIAPIPE TYPES ====================

/**
 * Single landmark coordinate in normalized space [0, 1]
 */
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Array of landmarks representing a hand
 */
export type NormalizedLandmarkList = NormalizedLandmark[];

/**
 * Results from MediaPipe Hands detection
 */
export interface HandsResults {
  multiHandLandmarks?: NormalizedLandmarkList[];
}

/**
 * Configuration options for MediaPipe Hands
 */
export interface HandsOptions {
  maxNumHands?: number;
  modelComplexity?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

/**
 * MediaPipe Hands API interface
 */
export interface Hands {
  setOptions: (options: HandsOptions) => void;
  onResults: (callback: (results: HandsResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
  close: () => void | Promise<void>;
}

/**
 * Global Window interface extension for MediaPipe
 */
declare global {
  interface Window {
    Hands: new (config: { locateFile: (file: string) => string }) => Hands;
  }
}

// ==================== SHARED STATE ====================

/**
 * Mutable state shared across components for hand tracking data
 */
export interface SharedState {
  handDetected: boolean;
  pinchDistance: number;
  handX: number;
  handY: number;
}

// ==================== GESTURE TYPES ====================

/**
 * Gesture direction for shape navigation
 */
export type GestureDirection = "next" | "prev";

// ==================== UI TYPES ====================

/**
 * Menu item configuration for shape selection
 */
export interface MenuItem<T = ShapeType> {
  id: T;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

// ==================== CONSTANTS ====================

/**
 * Gesture detection thresholds and cooldowns
 */
export const GESTURE_CONSTANTS = {
  SWIPE_THRESHOLD: 0.06,
  SWIPE_COOLDOWN: 800, // milliseconds
  PINCH_MIN_DISTANCE: 0.02,
  PINCH_SCALE_FACTOR: 7,
  PINCH_MAX_VALUE: 1.5,
} as const;

/**
 * Animation and interpolation constants
 */
export const ANIMATION_CONSTANTS = {
  LERP_SPEED_MOBILE: 3.0,
  LERP_SPEED_DESKTOP: 4.0,
  ROTATION_SPEED_MOBILE: 0.0005,
  ROTATION_SPEED_DESKTOP: 0.001,
  NOISE_AMPLITUDE: 0.05,
  NOISE_FREQUENCY: 2,
} as const;

/**
 * Color constants for particle system
 */
export const COLOR_CONSTANTS = {
  ACTIVE_SATURATION: 0.8,
  ACTIVE_LIGHTNESS: 0.6,
  INACTIVE_HUE: 0.6,
  INACTIVE_SATURATION: 0.1,
  INACTIVE_LIGHTNESS: 0.2,
  HUE_SHIFT_RANGE: 0.2,
} as const;

/**
 * Hand tracking update intervals
 */
export const TRACKING_CONSTANTS = {
  STATUS_UPDATE_INTERVAL: 200, // milliseconds
  HAND_X_LERP: 0.1,
  PINCH_LERP_ACTIVE: 0.2,
  PINCH_LERP_INACTIVE: 0.05,
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
} as const;

/**
 * MediaPipe CDN URLs
 */
export const MEDIAPIPE_CDN = {
  HANDS_JS: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
  BASE_URL: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/",
} as const;

/**
 * Default responsive configurations
 */
export const DEFAULT_CONFIGS: Record<
  "mobile" | "tablet" | "desktop",
  ResponsiveConfig
> = {
  mobile: {
    particleCount: 4000,
    particleSize: 0.08,
    cameraWidth: 480,
    cameraHeight: 360,
    modelComplexity: 0,
    cameraPosition: [0, 0, 30],
    cameraFov: 75,
    autoRotate: false,
  },
  tablet: {
    particleCount: 6000,
    particleSize: 0.1,
    cameraWidth: 640,
    cameraHeight: 480,
    modelComplexity: 1,
    cameraPosition: [0, 0, 28],
    cameraFov: 65,
    autoRotate: true,
  },
  desktop: {
    particleCount: 8000,
    particleSize: 0.12,
    cameraWidth: 640,
    cameraHeight: 480,
    modelComplexity: 1,
    cameraPosition: [0, 0, 25],
    cameraFov: 60,
    autoRotate: true,
  },
} as const;

/**
 * Ordered list of all available shapes
 * Used for cycling through shapes with gestures
 */
export const SHAPE_LIST: readonly ShapeType[] = [
  "heart",
  "sphere",
  "flower",
  "spiral",
] as const;
