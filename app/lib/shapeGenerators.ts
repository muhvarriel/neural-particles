"use client";

/**
 * 3D Shape position generators
 * Mathematical functions for generating particle positions in various shapes
 * @module lib/shapeGenerators
 */

import { type ShapeType } from "./constants";

/**
 * Generate particle positions for a given shape
 *
 * @param type - Shape type to generate
 * @param count - Number of particles
 * @returns Float32Array of [x, y, z] positions
 */
export const generatePositions = (
  type: ShapeType,
  count: number,
): Float32Array => {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    let x = 0;
    let y = 0;
    let z = 0;

    switch (type) {
      case "heart":
        {
          const t = Math.random() * Math.PI * 2;
          const p = Math.random() * Math.PI * 2;
          x = 16 * Math.pow(Math.sin(t), 3);
          y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);
          z = 4 * Math.sin(p) * Math.sin(t);
          x *= 0.3;
          y *= 0.3;
          z *= 0.3;
          y += 1;
        }
        break;

      case "sphere":
        {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 6;
          // ✅ FIX: Changed let to const (lines 45, 46, 51)
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
          positions[idx] = x;
          positions[idx + 1] = y;
          positions[idx + 2] = z;
        }
        break;

      case "flower":
        {
          const u = Math.random() * Math.PI * 4;
          const v = Math.random() * Math.PI;
          const r = 5 * Math.sin(2 * u);
          x = r * Math.cos(u) * Math.sin(v);
          y = r * Math.sin(u) * Math.sin(v);
          z = 2 * Math.cos(v);
        }
        break;

      case "spiral":
        {
          const t = (i / count) * 20 * Math.PI;
          const r = (i / count) * 8;
          x = r * Math.cos(t);
          y = (i / count - 0.5) * 10;
          z = r * Math.sin(t);
        }
        break;

      default: {
        // Default to sphere if unknown type
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 6;
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
      }
    }

    // Only assign if not handled in switch block
    if (type !== "sphere") {
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;
    }
  }

  return positions;
};
