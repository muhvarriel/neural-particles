"use client";

/**
 * Particle system component with Three.js integration
 * Renders animated 3D particle formations with hand gesture control
 * @module components/particles/ParticleSystem
 */

import React, { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useWindowSize, getResponsiveConfig } from "@/app/hooks/useWindowSize";
import { generatePositions } from "@/app/lib/shapeGenerators";
import { sharedState } from "@/app/lib/sharedState";
import {
  type ShapeType,
  ANIMATION_CONSTANTS,
  COLOR_CONSTANTS,
} from "@/app/lib/constants";

/**
 * Component props
 */
interface ParticleSystemProps {
  /**
   * Active shape to morph into
   */
  activeShape: ShapeType;
  /**
   * Optional initial shape (default: "sphere")
   */
  initialShape?: ShapeType;
}

/**
 * Calculate particle expansion based on pinch distance
 *
 * @param pinchDistance - Normalized pinch distance (0-1.5)
 * @returns Expansion multiplier
 */
const calculateExpansion = (pinchDistance: number): number => {
  let expansion = 0.2 + pinchDistance * 0.8;

  // Explosive effect when hand fully open
  if (pinchDistance > 0.95) {
    expansion = 1.0 + (pinchDistance - 0.95) * 5.0;
  }

  return expansion;
};

/**
 * Calculate color for a particle based on state
 *
 * @param handDetected - Whether hand is detected
 * @param baseHue - Base hue from hand position (0-1)
 * @param hueShift - Individual particle hue shift
 * @param colorObj - Reusable THREE.Color object
 */
const calculateParticleColor = (
  handDetected: boolean,
  baseHue: number,
  hueShift: number,
  colorObj: THREE.Color,
): void => {
  if (handDetected) {
    colorObj.setHSL(
      (baseHue + hueShift) % 1,
      COLOR_CONSTANTS.ACTIVE_SATURATION,
      COLOR_CONSTANTS.ACTIVE_LIGHTNESS,
    );
  } else {
    colorObj.setHSL(
      COLOR_CONSTANTS.INACTIVE_HUE,
      COLOR_CONSTANTS.INACTIVE_SATURATION,
      COLOR_CONSTANTS.INACTIVE_LIGHTNESS,
    );
  }
};

/**
 * ParticleSystem Component
 *
 * Core Three.js particle system with smooth morphing animations between shapes.
 * Integrates with hand tracking via shared state for real-time interaction.
 *
 * Features:
 * - 4000-8000 particles (responsive)
 * - Smooth lerp-based morphing between shapes
 * - Dynamic color based on hand position
 * - Expansion/compression via pinch gesture
 * - Additive blending for glow effect
 * - Auto-rotation
 * - Noise-based animation
 *
 * Performance Optimizations:
 * - Reusable THREE.Color object
 * - Buffer attribute updates only when needed
 * - Memoized target positions
 * - Efficient typed arrays
 *
 * @example
 * ```
 * <Canvas>
 *   <ParticleSystem activeShape="heart" />
 * </Canvas>
 * ```
 */
export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  activeShape,
  initialShape = "sphere",
}) => {
  const windowSize = useWindowSize();
  const config = getResponsiveConfig(windowSize);

  // Three.js refs
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Initialize current positions (mutable, updated each frame)
  const [currentPositions] = useState<Float32Array>(() =>
    generatePositions(initialShape, config.particleCount),
  );

  // Target positions (recalculated when shape changes)
  const targetPositions = useMemo(
    () => generatePositions(activeShape, config.particleCount),
    [activeShape, config.particleCount],
  );

  // Color array (mutable, updated each frame)
  const colorArray = useMemo(
    () => new Float32Array(config.particleCount * 3),
    [config.particleCount],
  );

  // Reusable color object (prevents GC pressure)
  const colorObj = useMemo(() => new THREE.Color(), []);

  /**
   * Animation frame loop
   * Updates particle positions and colors based on hand tracking state
   */
  useFrame((state, delta) => {
    if (!pointsRef.current || !geometryRef.current) return;

    // Get buffer attributes
    const positionAttr = geometryRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const colorAttr = geometryRef.current.getAttribute(
      "color",
    ) as THREE.BufferAttribute;

    const positions = positionAttr.array as Float32Array;
    const colors = colorAttr.array as Float32Array;

    // Read shared state (updated by HandController)
    const { pinchDistance, handX, handDetected } = sharedState;

    // Calculate lerp speed based on device
    const lerpSpeed = windowSize.isMobile
      ? ANIMATION_CONSTANTS.LERP_SPEED_MOBILE * delta
      : ANIMATION_CONSTANTS.LERP_SPEED_DESKTOP * delta;

    // Base hue driven by horizontal hand position
    const baseHue = handX;

    // Calculate expansion from pinch gesture
    const expansion = calculateExpansion(pinchDistance);

    // Update each particle
    for (let i = 0; i < config.particleCount; i++) {
      const idx = i * 3;

      // ✅ FIX: Changed let to const (lines 177, 178, 179)
      // Get target position and apply expansion
      const tx = targetPositions[idx] * expansion;
      const ty = targetPositions[idx + 1] * expansion;
      const tz = targetPositions[idx + 2] * expansion;

      // Add time-based noise for organic movement
      const noise =
        Math.sin(
          state.clock.elapsedTime * ANIMATION_CONSTANTS.NOISE_FREQUENCY + i,
        ) * ANIMATION_CONSTANTS.NOISE_AMPLITUDE;

      // Smooth lerp to target position with noise
      positions[idx] += (tx - positions[idx] + noise) * lerpSpeed;
      positions[idx + 1] += (ty - positions[idx + 1] + noise) * lerpSpeed;
      positions[idx + 2] += (tz - positions[idx + 2] + noise) * lerpSpeed;

      // Calculate color with individual hue shift
      const hueShift =
        (i / config.particleCount) * COLOR_CONSTANTS.HUE_SHIFT_RANGE;
      calculateParticleColor(handDetected, baseHue, hueShift, colorObj);

      // Update color buffer
      colors[idx] = colorObj.r;
      colors[idx + 1] = colorObj.g;
      colors[idx + 2] = colorObj.b;
    }

    // Mark attributes as needing GPU update
    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;

    // Auto-rotation
    pointsRef.current.rotation.y += windowSize.isMobile
      ? ANIMATION_CONSTANTS.ROTATION_SPEED_MOBILE
      : ANIMATION_CONSTANTS.ROTATION_SPEED_DESKTOP;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        {/* Position attribute */}
        <bufferAttribute
          attach="attributes-position"
          count={config.particleCount}
          array={currentPositions}
          itemSize={3}
          args={[currentPositions, 3]}
        />
        {/* Color attribute */}
        <bufferAttribute
          attach="attributes-color"
          count={config.particleCount}
          array={colorArray}
          itemSize={3}
          args={[colorArray, 3]}
        />
      </bufferGeometry>
      {/* Material with additive blending for glow effect */}
      <pointsMaterial
        size={config.particleSize}
        vertexColors
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

export default ParticleSystem;
