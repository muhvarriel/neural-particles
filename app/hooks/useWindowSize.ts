"use client";

/**
 * Window size detection hook with responsive configuration
 * Provides real-time window dimensions and device categorization
 * @module hooks/useWindowSize
 */

import { useEffect, useState } from "react";
import {
  type WindowSize,
  type ResponsiveConfig,
  BREAKPOINTS,
  DEFAULT_CONFIGS,
} from "@/app/lib/constants";

/**
 * Default window size for SSR (Server-Side Rendering)
 * Used during initial render before client-side hydration
 */
const SSR_DEFAULT_WINDOW_SIZE: WindowSize = {
  width: 1920,
  height: 1080,
  isMobile: false,
  isTablet: false,
};

/**
 * Calculate device category based on window width
 *
 * @param width - Window width in pixels
 * @returns Device categorization flags
 */
const calculateDeviceType = (
  width: number,
): Pick<WindowSize, "isMobile" | "isTablet"> => {
  return {
    isMobile: width < BREAKPOINTS.MOBILE,
    isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET,
  };
};

/**
 * Get initial window size safely for both SSR and CSR
 *
 * @returns Initial WindowSize object
 */
const getInitialWindowSize = (): WindowSize => {
  if (typeof window === "undefined") {
    return SSR_DEFAULT_WINDOW_SIZE;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const deviceType = calculateDeviceType(width);

  return {
    width,
    height,
    ...deviceType,
  };
};

/**
 * React hook for responsive window size detection
 *
 * Automatically updates on window resize with debouncing via requestAnimationFrame
 * Safe for SSR environments (Next.js App Router)
 *
 * @returns WindowSize object with current dimensions and device flags
 *
 * @example
 * ```
 * function MyComponent() {
 *   const windowSize = useWindowSize();
 *
 *   if (windowSize.isMobile) {
 *     return <MobileView />;
 *   }
 *
 *   return <DesktopView />;
 * }
 * ```
 */
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] =
    useState<WindowSize>(getInitialWindowSize);

  useEffect(() => {
    // Skip if running on server
    if (typeof window === "undefined") {
      return;
    }

    let rafId: number | null = null;

    /**
     * Handle window resize with RAF debouncing
     * Prevents excessive re-renders during resize
     */
    const handleResize = (): void => {
      // Cancel previous RAF if exists
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Schedule update on next frame
      rafId = requestAnimationFrame(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const deviceType = calculateDeviceType(width);

        setWindowSize({
          width,
          height,
          ...deviceType,
        });
      });
    };

    // Set up event listener
    window.addEventListener("resize", handleResize);

    // Call once to ensure correct initial state after mount
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return windowSize;
};

/**
 * Get responsive configuration based on window size
 *
 * Returns optimized settings for particle count, camera, and rendering
 * based on device category (mobile/tablet/desktop)
 *
 * @param windowSize - Current window size from useWindowSize hook
 * @returns ResponsiveConfig with optimized settings
 *
 * @example
 * ```
 * function ParticleSystem() {
 *   const windowSize = useWindowSize();
 *   const config = getResponsiveConfig(windowSize);
 *
 *   // config.particleCount: 4000 (mobile) | 6000 (tablet) | 8000 (desktop)
 *   // config.modelComplexity: 0 (mobile) | 1 (tablet/desktop)
 * }
 * ```
 */
export const getResponsiveConfig = (
  windowSize: WindowSize,
): ResponsiveConfig => {
  if (windowSize.isMobile) {
    return DEFAULT_CONFIGS.mobile;
  }

  if (windowSize.isTablet) {
    return DEFAULT_CONFIGS.tablet;
  }

  return DEFAULT_CONFIGS.desktop;
};

/**
 * Get device type as string for logging/analytics
 *
 * @param windowSize - Current window size
 * @returns Device type identifier
 */
export const getDeviceType = (
  windowSize: WindowSize,
): "mobile" | "tablet" | "desktop" => {
  if (windowSize.isMobile) return "mobile";
  if (windowSize.isTablet) return "tablet";
  return "desktop";
};

/**
 * Check if current environment is mobile
 * Convenience function for conditional rendering
 *
 * @param windowSize - Current window size
 * @returns true if mobile device
 */
export const isMobileDevice = (windowSize: WindowSize): boolean => {
  return windowSize.isMobile;
};

/**
 * Check if current environment is tablet
 *
 * @param windowSize - Current window size
 * @returns true if tablet device
 */
export const isTabletDevice = (windowSize: WindowSize): boolean => {
  return windowSize.isTablet;
};

/**
 * Check if current environment is desktop
 *
 * @param windowSize - Current window size
 * @returns true if desktop device
 */
export const isDesktopDevice = (windowSize: WindowSize): boolean => {
  return !windowSize.isMobile && !windowSize.isTablet;
};

/**
 * Get responsive value based on device type
 *
 * @param windowSize - Current window size
 * @param values - Object with values for each device type
 * @returns Value for current device type
 *
 * @example
 * ```
 * const fontSize = getResponsiveValue(windowSize, {
 *   mobile: '14px',
 *   tablet: '16px',
 *   desktop: '18px'
 * });
 * ```
 */
export const getResponsiveValue = <T>(
  windowSize: WindowSize,
  values: {
    mobile: T;
    tablet: T;
    desktop: T;
  },
): T => {
  if (windowSize.isMobile) return values.mobile;
  if (windowSize.isTablet) return values.tablet;
  return values.desktop;
};

/**
 * Hook that returns both window size and responsive config
 * Convenience hook combining useWindowSize and getResponsiveConfig
 *
 * @returns Tuple of [windowSize, config]
 *
 * @example
 * ```
 * function MyComponent() {
 *   const [windowSize, config] = useResponsive();
 *
 *   return (
 *     <Canvas camera={{ fov: config.cameraFov }}>
 *       <Particles count={config.particleCount} />
 *     </Canvas>
 *   );
 * }
 * ```
 */
export const useResponsive = (): [WindowSize, ResponsiveConfig] => {
  const windowSize = useWindowSize();
  const config = getResponsiveConfig(windowSize);
  return [windowSize, config];
};
