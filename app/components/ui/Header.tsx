"use client";

/**
 * Header component with title and hand tracking status indicator
 * @module components/ui/Header
 */

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { Activity } from "lucide-react";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import { sharedState } from "@/app/lib/sharedState";
import { TRACKING_CONSTANTS } from "@/app/lib/constants";
import { GestureInstructions } from "./GestureInstructions";

/**
 * Component props
 */
interface HeaderProps {
  /**
   * Optional CSS class name
   */
  className?: string;
  /**
   * Show gesture instructions below header (desktop only)
   * @default true
   */
  showInstructions?: boolean;
}

/**
 * Status indicator colors
 */
const STATUS_COLORS = {
  active: "#00f3ff",
  inactive: "#ff4d4d",
} as const;

/**
 * Client-side mount detection using useSyncExternalStore
 * ✅ FIX: Avoid setState in useEffect
 */
const subscribe = () => () => {};
const useHydrated = () => {
  return useSyncExternalStore(
    subscribe,
    () => true, // Client
    () => false, // Server
  );
};

/**
 * Header Component
 *
 * Displays the application title with a real-time hand tracking status indicator.
 * Includes an animated pulse effect on the status dot.
 *
 * Features:
 * - Glassmorphism design with neon accent border
 * - Real-time hand tracking status polling
 * - Animated pulsing indicator dot
 * - Responsive typography and spacing
 * - Optional gesture instructions panel
 * - Client-only rendering to prevent hydration mismatch
 *
 * @example
 * ```
 * <Header />
 * <Header showInstructions={false} />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  className = "",
  showInstructions = true,
}) => {
  const windowSize = useWindowSize();
  const [handDetected, setHandDetected] = useState<boolean>(false);
  const hydrated = useHydrated(); // ✅ FIX: Use useSyncExternalStore instead of useEffect

  // Poll shared state for hand detection status
  useEffect(() => {
    const interval = setInterval(() => {
      if (sharedState.handDetected !== handDetected) {
        setHandDetected(sharedState.handDetected);
      }
    }, TRACKING_CONSTANTS.STATUS_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [handDetected]);

  // ✅ FIX: Render placeholder during SSR
  if (!hydrated) {
    return (
      <div
        className={className}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          zIndex: 50,
          pointerEvents: "none",
        }}
      >
        <header
          style={{
            background: "rgba(5, 20, 25, 0.7)",
            backdropFilter: "blur(10px)",
            borderLeft: `4px solid ${STATUS_COLORS.active}`,
            padding: "15px 25px",
            borderRadius: "0 12px 12px 0",
            boxShadow: `0 10px 30px -10px ${STATUS_COLORS.active}33`,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
          role="banner"
          aria-label="Neural Particles header with tracking status"
        >
          <h1
            style={{
              margin: 0,
              fontSize: "1.8rem",
              fontWeight: 700,
              letterSpacing: "1px",
              color: "white",
              fontFamily: "'Outfit', sans-serif",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "nowrap",
            }}
          >
            Neural{" "}
            <span
              style={{
                color: STATUS_COLORS.active,
                fontWeight: 300,
              }}
            >
              Particles
            </span>
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: STATUS_COLORS.inactive,
              fontFamily: "'Outfit', sans-serif",
              marginTop: "5px",
              letterSpacing: "0.5px",
            }}
            role="status"
            aria-live="polite"
          >
            <Activity size={14} aria-hidden="true" />
            <span>SYSTEM STATUS: HAND SEARCHING...</span>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: STATUS_COLORS.inactive,
                boxShadow: `0 0 10px ${STATUS_COLORS.inactive}`,
              }}
              aria-hidden="true"
            />
          </div>
        </header>
      </div>
    );
  }

  // ✅ Client-side render with actual responsive values
  const statusColor = handDetected
    ? STATUS_COLORS.active
    : STATUS_COLORS.inactive;
  const statusText = handDetected ? "TRACKED" : "SEARCHING...";
  const fullStatusText = windowSize.isMobile
    ? statusText
    : `SYSTEM STATUS: HAND ${statusText}`;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: windowSize.isMobile ? "15px" : "30px",
        left: windowSize.isMobile ? "15px" : "30px",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {/* Main Header Card */}
      <header
        style={{
          background: "rgba(5, 20, 25, 0.7)",
          backdropFilter: "blur(10px)",
          borderLeft: `${windowSize.isMobile ? "3px" : "4px"} solid ${STATUS_COLORS.active}`,
          padding: windowSize.isMobile ? "10px 15px" : "15px 25px",
          borderRadius: windowSize.isMobile ? "0 8px 8px 0" : "0 12px 12px 0",
          boxShadow: `0 10px 30px -10px ${STATUS_COLORS.active}33`,
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
        role="banner"
        aria-label="Neural Particles header with tracking status"
      >
        {/* Title */}
        <h1
          style={{
            margin: 0,
            fontSize: windowSize.isMobile
              ? "clamp(1rem, 5vw, 1.3rem)"
              : "1.8rem",
            fontWeight: 700,
            letterSpacing: "1px",
            color: "white",
            fontFamily: "'Outfit', sans-serif",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: windowSize.isMobile ? "6px" : "10px",
            flexWrap: windowSize.isMobile ? "wrap" : "nowrap",
          }}
        >
          Neural{" "}
          <span
            style={{
              color: STATUS_COLORS.active,
              fontWeight: 300,
            }}
          >
            Particles
          </span>
        </h1>

        {/* Status Indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: windowSize.isMobile ? "6px" : "8px",
            fontSize: windowSize.isMobile
              ? "clamp(0.65rem, 2vw, 0.75rem)"
              : "0.8rem",
            fontWeight: 500,
            color: statusColor,
            fontFamily: "'Outfit', sans-serif",
            marginTop: "5px",
            letterSpacing: "0.5px",
          }}
          role="status"
          aria-live="polite"
          aria-label={`Hand tracking status: ${statusText}`}
        >
          <Activity size={windowSize.isMobile ? 12 : 14} aria-hidden="true" />
          <span>{fullStatusText}</span>

          {/* Pulsing Dot Indicator */}
          <span
            style={{
              width: windowSize.isMobile ? "6px" : "8px",
              height: windowSize.isMobile ? "6px" : "8px",
              borderRadius: "50%",
              background: statusColor,
              boxShadow: `0 0 10px ${statusColor}`,
              animation: "pulse 1.5s infinite",
            }}
            aria-hidden="true"
          />
        </div>
      </header>

      {/* Gesture Instructions */}
      {showInstructions && <GestureInstructions />}

      {/* Pulse Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 ${statusColor}b3;
          }
          70% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 10px ${statusColor}00;
          }
          100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 ${statusColor}00;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
