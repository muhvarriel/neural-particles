"use client";

/**
 * Three.js Canvas wrapper with scene setup
 * Provides rendering context for particle system
 * @module components/particles/ParticleCanvas
 */

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useResponsive } from "@/app/hooks/useWindowSize";
import { ParticleSystem } from "./ParticleSystem";
import type { ShapeType } from "@/app/lib/constants";

/**
 * Component props
 */
interface ParticleCanvasProps {
  /**
   * Active shape for particle system
   */
  activeShape: ShapeType;
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Optional loading fallback component
   */
  fallback?: React.ReactNode;
}

/**
 * Scene background color
 */
const SCENE_BACKGROUND = "#050505";

/**
 * Fog configuration
 */
const FOG_CONFIG = {
  color: SCENE_BACKGROUND,
  near: 10,
  far: 60,
} as const;

/**
 * OrbitControls configuration
 */
const ORBIT_CONTROLS_CONFIG = {
  enableZoom: false,
  enablePan: false,
  autoRotateSpeed: 0.5,
} as const;

/**
 * Default loading fallback
 */
const DefaultFallback: React.FC = () => (
  <Text
    color="white"
    fontSize={0.5}
    anchorX="center"
    anchorY="middle"
    position={[0, 0, 0]}
  >
    Loading 3D...
  </Text>
);

/**
 * ParticleCanvas Component
 *
 * Wrapper component that sets up Three.js Canvas with responsive camera,
 * lighting, fog, and orbit controls. Integrates ParticleSystem with Suspense
 * for code-splitting and loading states.
 *
 * Features:
 * - Responsive camera setup (FOV, position)
 * - Atmospheric fog effect
 * - OrbitControls with auto-rotation
 * - Suspense boundary for lazy loading
 * - Dark background for particle visibility
 *
 * Camera Configuration:
 * - Mobile: FOV 75°, distance 30
 * - Tablet: FOV 65°, distance 28
 * - Desktop: FOV 60°, distance 25
 *
 * @example
 * ```
 * <ParticleCanvas activeShape="sphere" />
 * ```
 */
export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  activeShape,
  className = "",
  fallback,
}) => {
  // ✅ FIX 4️⃣: Removed unused windowSize (line 101)
  const [, config] = useResponsive();

  return (
    <Canvas
      className={className}
      camera={{
        position: config.cameraPosition,
        fov: config.cameraFov,
        near: 0.1,
        far: 1000,
      }}
      dpr={[1, 2]} // Device pixel ratio (min, max)
      performance={{
        min: 0.5, // Minimum performance (lower = better quality)
      }}
    >
      {/* Scene background color */}
      <color attach="background" args={[SCENE_BACKGROUND]} />

      {/* Atmospheric fog */}
      <fog
        attach="fog"
        args={[FOG_CONFIG.color, FOG_CONFIG.near, FOG_CONFIG.far]}
      />

      {/* Particle system with suspense boundary */}
      <Suspense fallback={fallback || <DefaultFallback />}>
        <ParticleSystem activeShape={activeShape} />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        enableZoom={ORBIT_CONTROLS_CONFIG.enableZoom}
        enablePan={ORBIT_CONTROLS_CONFIG.enablePan}
        autoRotate={config.autoRotate}
        autoRotateSpeed={ORBIT_CONTROLS_CONFIG.autoRotateSpeed}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4} // Limit vertical rotation
        maxPolarAngle={(Math.PI * 3) / 4}
      />
    </Canvas>
  );
};

export default ParticleCanvas;
