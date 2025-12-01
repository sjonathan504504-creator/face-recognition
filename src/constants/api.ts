import type { Orientation } from "../types/orientation";

/**rotation tolerance in degrees */
export const ROTATION_TOLERANCES = {
  yaw: 4,
  pitch: 4,
  roll: 4,
} as const;

export type RotationToleranceKeys = keyof typeof ROTATION_TOLERANCES;

export const ORIENTATION_PRESETS: Orientation[] = [
  { yaw: 0, pitch: 0, roll: 0 }, // Centered
  { yaw: -15, pitch: 0, roll: 0 }, // Left
  { yaw: 15, pitch: 0, roll: 0 }, // Right
  { yaw: 0, pitch: -15, roll: 0 }, // Top
  { yaw: 0, pitch: 15, roll: 0 }, // Bottom
];

export const MODEL_PATH: string = "/src/models/face_landmarker.task";
