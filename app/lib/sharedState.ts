/**
 * Shared mutable state for hand tracking data
 * This allows efficient communication between components without React re-renders
 * @module lib/sharedState
 */

import type { SharedState } from "./constants";

/**
 * Global mutable state object
 * Updated by HandController and read by ParticleSystem
 *
 * @property handDetected - Whether a hand is currently detected
 * @property pinchDistance - Normalized distance between thumb and index (0-1.5)
 * @property handX - Horizontal hand position in normalized space (0-1)
 * @property handY - Vertical hand position in normalized space (0-1)
 */
export const sharedState: SharedState = {
  handDetected: false,
  pinchDistance: 1.0,
  handX: 0.5,
  handY: 0.5,
};

/**
 * Reset shared state to default values
 */
export const resetSharedState = (): void => {
  sharedState.handDetected = false;
  sharedState.pinchDistance = 1.0;
  sharedState.handX = 0.5;
  sharedState.handY = 0.5;
};

/**
 * Update hand detection status
 */
export const setHandDetected = (detected: boolean): void => {
  sharedState.handDetected = detected;
};

/**
 * Update pinch distance with bounds checking
 */
export const setPinchDistance = (distance: number): void => {
  sharedState.pinchDistance = Math.max(0, Math.min(1.5, distance));
};

/**
 * Update hand position with bounds checking
 */
export const setHandPosition = (x: number, y: number): void => {
  sharedState.handX = Math.max(0, Math.min(1, x));
  sharedState.handY = Math.max(0, Math.min(1, y));
};

/**
 * Get current shared state as immutable snapshot
 */
export const getSharedStateSnapshot = (): Readonly<SharedState> => {
  return {
    handDetected: sharedState.handDetected,
    pinchDistance: sharedState.pinchDistance,
    handX: sharedState.handX,
    handY: sharedState.handY,
  };
};
