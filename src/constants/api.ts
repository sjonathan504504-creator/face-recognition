export const ROTATION_TOLERANCES = {
  yaw: 4, // degrés (tolérance gauche/droite)
  pitch: 4, // degrés (tolérance haut/bas)
  roll: 4, // degrés (tolérance inclinaison)
} as const;

export type RotationToleranceKeys = keyof typeof ROTATION_TOLERANCES;
