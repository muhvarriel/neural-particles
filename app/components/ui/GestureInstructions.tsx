"use client";

/**
 * Gesture instructions overlay component
 * Displays hand gesture controls for desktop users only
 * @module components/ui/GestureInstructions
 */

import React from "react";
import { Activity, Hand, ScanFace } from "lucide-react";
import { useWindowSize } from "@/app/hooks/useWindowSize";

/**
 * Instruction item configuration
 */
interface InstructionItem {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  label: string;
  action: string;
}

/**
 * Component props
 */
interface GestureInstructionsProps {
  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * Gesture instruction items
 */
const INSTRUCTIONS: readonly InstructionItem[] = [
  {
    icon: ScanFace,
    label: "Pinch",
    action: "to Compress",
  },
  {
    icon: Hand,
    label: "Open Hand",
    action: "to Explode",
  },
  {
    icon: Activity,
    label: "Swipe",
    action: "to Switch Shape",
  },
] as const;

/**
 * GestureInstructions Component
 *
 * Displays a glassmorphic panel with gesture control instructions.
 * Only visible on desktop devices (hidden on mobile/tablet).
 *
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Icon-based visual instructions
 * - Responsive typography
 * - Auto-hidden on mobile devices
 *
 * @example
 * ```
 * <GestureInstructions />
 * ```
 */
export const GestureInstructions: React.FC<GestureInstructionsProps> = ({
  className = "",
}) => {
  const windowSize = useWindowSize();

  // Hide on mobile and tablet devices
  if (windowSize.isMobile || windowSize.isTablet) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        marginTop: "20px",
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(5px)",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#ccc",
        fontSize: "0.85rem",
        fontFamily: "'Outfit', sans-serif",
        maxWidth: "250px",
        lineHeight: "1.8",
        fontWeight: 300,
      }}
      role="complementary"
      aria-label="Gesture controls instructions"
    >
      {INSTRUCTIONS.map((instruction, index) => {
        const Icon = instruction.icon;
        const isLast = index === INSTRUCTIONS.length - 1;

        return (
          <div
            key={instruction.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: isLast ? "0" : "8px",
            }}
          >
            <Icon
              size={18}
              color="#00f3ff"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span>
              <b>{instruction.label}</b> {instruction.action}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default GestureInstructions;
