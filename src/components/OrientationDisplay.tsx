import "../styles/OrientationDisplay.css";
import type { Orientation } from "../types/orientation";
import { ROTATION_TOLERANCES } from "../constants";

type OrientationDisplayProps = {
  orientation: Orientation;
  targetOrientation: Orientation;
};

const formatTargetWithTolerance = (
  target: number | undefined,
  tolerance: number
): string => {
  if (target === undefined) return "...";
  return `${target.toFixed(1)}° ±${tolerance.toFixed(1)}°`;
};

function OrientationDisplay({
  orientation,
  targetOrientation,
}: OrientationDisplayProps) {
  const { yaw, pitch, roll } = orientation;
  const {
    yaw: targetYaw,
    pitch: targetPitch,
    roll: targetRoll,
  } = targetOrientation;

  const yawMessage = getYawMessage(yaw, targetYaw);
  const pitchMessage = getPitchMessage(pitch, targetPitch);
  const rollMessage = getRollMessage(roll, targetRoll);

  const hasTargets =
    targetYaw !== undefined &&
    targetPitch !== undefined &&
    targetRoll !== undefined;

  const hasAnyMessage = !!(yawMessage || pitchMessage || rollMessage);
  const isPerfect = hasTargets && !hasAnyMessage;

  return (
    <div className="orientation-panel">
      <h2 className="orientation-title">Orientation du visage</h2>

      <div className="orientation-values">
        <div className="orientation-block">
          <div className="orientation-label">Lacet (horiz.)</div>
          <strong>{yaw?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            / cible{" "}
            {formatTargetWithTolerance(targetYaw, ROTATION_TOLERANCES.yaw)}
          </span>
        </div>

        <div className="orientation-block">
          <div className="orientation-label">Tangage (vert.)</div>
          <strong>{pitch?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            / cible{" "}
            {formatTargetWithTolerance(targetPitch, ROTATION_TOLERANCES.pitch)}
          </span>
        </div>

        <div className="orientation-block">
          <div className="orientation-label">Roulis (latéral)</div>
          <strong>{roll?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            / cible{" "}
            {formatTargetWithTolerance(targetRoll, ROTATION_TOLERANCES.roll)}
          </span>
        </div>
      </div>

      {/* Reste identique */}
      <div className="orientation-messages">
        {isPerfect ? (
          <div className="orientation-message orientation-message-ok">
            <span className="orientation-dot orientation-dot-ok" />
            Parfait, ne bougez plus. Capture en cours…
          </div>
        ) : hasTargets ? (
          <>
            {yawMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-ko" />
                {yawMessage}
              </div>
            )}
            {pitchMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-ko" />
                {pitchMessage}
              </div>
            )}
            {rollMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-ko" />
                {rollMessage}
              </div>
            )}
          </>
        ) : (
          <div className="orientation-message orientation-message-waiting">
            <span className="orientation-dot orientation-dot-waiting" />
            📸 Captures complétées 🎉
          </div>
        )}
      </div>
    </div>
  );
}

// Fonctions messages inchangées
function getYawMessage(
  yaw: number | undefined,
  targetYaw: number | undefined
): string | null {
  if (yaw === undefined || targetYaw === undefined) return null;
  const delta = yaw - targetYaw;
  if (Math.abs(delta) <= ROTATION_TOLERANCES.yaw) return null;
  if (delta > 0) return "Tournez lentement la tête vers la gauche.";
  return "Tournez lentement la tête vers la droite.";
}

function getPitchMessage(
  pitch: number | undefined,
  targetPitch: number | undefined
): string | null {
  if (pitch === undefined || targetPitch === undefined) return null;
  const delta = pitch - targetPitch;
  if (Math.abs(delta) <= ROTATION_TOLERANCES.pitch) return null;
  if (delta > 0) return "Baissez lentement la tête.";
  return "Levez lentement la tête.";
}

function getRollMessage(
  roll: number | undefined,
  targetRoll: number | undefined
): string | null {
  if (roll === undefined || targetRoll === undefined) return null;
  const delta = roll - targetRoll;
  if (Math.abs(delta) <= ROTATION_TOLERANCES.roll) return null;
  if (delta > 0) return "Inclinez lentement la tête vers l'épaule droite.";
  return "Inclinez lentement la tête vers l'épaule gauche.";
}

export default OrientationDisplay;
