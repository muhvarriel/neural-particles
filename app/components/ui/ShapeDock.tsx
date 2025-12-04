"use client";

/**
 * Shape selection dock component
 * Bottom-center floating menu for shape selection
 * @module components/ui/ShapeDock
 */

import React, {
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { Heart, Globe, Flower2, Command, type LucideIcon } from "lucide-react";
import { useWindowSize } from "@/app/hooks/useWindowSize";
import { type ShapeType } from "@/app/lib/constants";

/**
 * Component props
 */
interface ShapeDockProps {
  /**
   * Currently active shape
   */
  activeShape: ShapeType;
  /**
   * Callback when shape is selected
   */
  onShapeChange: (shape: ShapeType) => void;
  /**
   * Optional CSS class name
   */
  className?: string;
}

/**
 * Menu item configuration
 */
interface MenuItem {
  id: ShapeType;
  label: string;
  icon: LucideIcon;
}

/**
 * Shape menu configuration with icons
 */
const SHAPE_MENU_ITEMS: readonly MenuItem[] = [
  {
    id: "heart",
    label: "Heart",
    icon: Heart,
  },
  {
    id: "sphere",
    label: "Sphere",
    icon: Globe,
  },
  {
    id: "flower",
    label: "Flower",
    icon: Flower2,
  },
  {
    id: "spiral",
    label: "Spiral",
    icon: Command,
  },
] as const;

/**
 * Theme colors for buttons
 */
const BUTTON_COLORS = {
  activeGradient: "linear-gradient(135deg, #00f3ff 0%, #0099ff 100%)",
  activeText: "#000",
  inactiveText: "#fff",
  hoverBg: "rgba(255, 255, 255, 0.08)",
  transparent: "transparent",
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
 * ShapeButton Component
 * Individual button for shape selection
 */
interface ShapeButtonProps {
  item: MenuItem;
  isActive: boolean;
  isMobile: boolean;
  onClick: () => void;
}

const ShapeButton: React.FC<ShapeButtonProps> = ({
  item,
  isActive,
  isMobile,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const Icon = item.icon;

  const buttonStyle: CSSProperties = {
    background: isActive
      ? BUTTON_COLORS.activeGradient
      : isHovered && !isMobile
        ? BUTTON_COLORS.hoverBg
        : BUTTON_COLORS.transparent,
    color: isActive ? BUTTON_COLORS.activeText : BUTTON_COLORS.inactiveText,
    border: "none",
    padding: isMobile ? "10px 16px" : "12px 24px",
    borderRadius: isMobile ? "12px" : "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: isMobile ? "6px" : "10px",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: isActive ? 600 : 400,
    fontSize: isMobile ? "clamp(0.75rem, 3vw, 0.85rem)" : "0.95rem",
    transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
    transform: isActive ? "scale(1.05)" : "scale(1)",
    boxShadow: isActive ? "0 8px 20px -5px rgba(0, 243, 255, 0.5)" : "none",
    position: "relative",
    overflow: "hidden",
    minWidth: isMobile ? "0" : undefined,
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      style={buttonStyle}
      aria-label={`Select ${item.label} shape`}
      aria-pressed={isActive}
      type="button"
    >
      <Icon size={isMobile ? 16 : 18} aria-hidden="true" />
      {!isMobile && <span>{item.label}</span>}
    </button>
  );
};

/**
 * ShapeDock Component
 *
 * Floating dock menu for shape selection positioned at bottom-center.
 * Adapts layout between grid (mobile) and flexbox (desktop).
 *
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Responsive grid (mobile) / flex (desktop) layout
 * - Active state with gradient and scale animation
 * - Hover effects on desktop
 * - Icon-only on mobile, icon + label on desktop
 * - Client-only rendering to prevent hydration mismatch
 *
 * @example
 * ```
 * <ShapeDock
 *   activeShape="sphere"
 *   onShapeChange={(shape) => setActiveShape(shape)}
 * />
 * ```
 */
export const ShapeDock: React.FC<ShapeDockProps> = ({
  activeShape,
  onShapeChange,
  className = "",
}) => {
  const windowSize = useWindowSize();
  const hydrated = useHydrated(); // ✅ FIX: Use useSyncExternalStore instead of useEffect

  // ✅ SSR placeholder
  if (!hydrated) {
    return (
      <nav
        className={className}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          gap: "12px",
          background: "rgba(15, 15, 15, 0.6)",
          backdropFilter: "blur(16px)",
          padding: "10px 15px",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
        }}
        role="navigation"
        aria-label="Shape selection menu"
      >
        {SHAPE_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeShape === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onShapeChange(item.id)}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, #00f3ff 0%, #0099ff 100%)"
                  : "transparent",
                color: isActive ? "#000" : "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.95rem",
                transition: "all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive
                  ? "0 8px 20px -5px rgba(0, 243, 255, 0.5)"
                  : "none",
              }}
              aria-label={`Select ${item.label} shape`}
              aria-pressed={isActive}
              type="button"
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  // ✅ Client-side render with responsive values
  const containerStyle: CSSProperties = {
    position: "absolute",
    bottom: windowSize.isMobile ? "15px" : "40px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
    display: windowSize.isMobile ? "grid" : "flex",
    gridTemplateColumns: windowSize.isMobile ? "1fr 1fr" : undefined,
    gap: windowSize.isMobile ? "8px" : "12px",
    background: "rgba(15, 15, 15, 0.6)",
    backdropFilter: "blur(16px)",
    padding: windowSize.isMobile ? "8px 12px" : "10px 15px",
    borderRadius: windowSize.isMobile ? "16px" : "24px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
    maxWidth: windowSize.isMobile ? "90vw" : undefined,
  };

  return (
    <nav
      className={className}
      style={containerStyle}
      role="navigation"
      aria-label="Shape selection menu"
    >
      {SHAPE_MENU_ITEMS.map((item) => (
        <ShapeButton
          key={item.id}
          item={item}
          isActive={activeShape === item.id}
          isMobile={windowSize.isMobile}
          onClick={() => onShapeChange(item.id)}
        />
      ))}
    </nav>
  );
};

export default ShapeDock;
