"use client";

/**
 * Neural Particles - Main orchestrator component
 * Coordinates all sub-components for interactive 3D particle visualization
 * @module components/ParticlePage
 */

import React, { useState, useCallback } from "react";
import { Header } from "@/app/components/ui/Header";
import { ShapeDock } from "@/app/components/ui/ShapeDock";
import { ParticleCanvas } from "@/app/components/particles/ParticleCanvas";
import { HandController } from "@/app/components/hand-tracking/HandController";
import {
  type ShapeType,
  type GestureDirection,
  SHAPE_LIST,
} from "@/app/lib/constants";

/**
 * Global styles for the application
 */
const GlobalStyles: React.FC = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap");

    * {
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: "Outfit", sans-serif;
    }

    body {
      background: #050505;
    }
  `}</style>
);

/**
 * Get next shape in cycle based on direction
 *
 * @param current - Current active shape
 * @param direction - Gesture direction (next or prev)
 * @returns Next shape in the cycle
 */
const getNextShape = (
  current: ShapeType,
  direction: GestureDirection,
): ShapeType => {
  const currentIndex = SHAPE_LIST.indexOf(current);
  const length = SHAPE_LIST.length;

  let newIndex: number;
  if (direction === "next") {
    newIndex = (currentIndex + 1) % length;
  } else {
    newIndex = (currentIndex - 1 + length) % length;
  }

  return SHAPE_LIST[newIndex];
};

/**
 * ParticlePage Component
 *
 * Main orchestrator component that manages application state and coordinates
 * all sub-components for the Neural Particles interactive experience.
 *
 * Component Architecture:
 * ```
 * ParticlePage (state management)
 *   ├── GlobalStyles
 *   ├── Header (with GestureInstructions)
 *   ├── ShapeDock
 *   ├── HandController
 *   └── ParticleCanvas
 *         └── ParticleSystem
 * ```
 *
 * State Flow:
 * - activeShape state drives particle morphing
 * - HandController updates sharedState (read by ParticleSystem)
 * - Gesture callbacks trigger shape changes
 * - All components read responsive config independently
 *
 * Features:
 * - Centralized state management
 * - Modular component composition
 * - Clean separation of concerns
 * - Type-safe prop passing
 * - Memoized callbacks for performance
 *
 * @example
 * ```
 * // In app/page.tsx
 * export default function Home() {
 *   return <ParticlePage />;
 * }
 * ```
 */
export default function ParticlePage() {
  // Active shape state (drives particle morphing)
  const [activeShape, setActiveShape] = useState<ShapeType>("sphere");

  /**
   * Handle swipe gesture from HandController
   * Cycles through shapes in the specified direction
   */
  const handleGesture = useCallback((direction: GestureDirection) => {
    setActiveShape((current) => getNextShape(current, direction));
  }, []);

  /**
   * Handle manual shape selection from ShapeDock
   */
  const handleShapeChange = useCallback((shape: ShapeType) => {
    setActiveShape(shape);
  }, []);

  /**
   * Handle errors from HandController
   */
  const handleError = useCallback((error: Error) => {
    console.error("HandController error:", error);
    // Could implement error UI here if needed
  }, []);

  return (
    <>
      {/* Global CSS */}
      <GlobalStyles />

      {/* Main container */}
      <main
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          touchAction: "none", // Prevent touch scrolling
          background: "#050505",
        }}
        role="main"
        aria-label="Neural Particles interactive visualization"
      >
        {/* Header with status and instructions */}
        <Header showInstructions />

        {/* Shape selection dock */}
        <ShapeDock
          activeShape={activeShape}
          onShapeChange={handleShapeChange}
        />

        {/* Hand tracking controller */}
        <HandController
          onGesture={handleGesture}
          onError={handleError}
          showLoadingIndicator
        />

        {/* 3D particle canvas */}
        <ParticleCanvas activeShape={activeShape} />
      </main>
    </>
  );
}
