import "../styles/OrientationDisplay.css";
import type { Orientation } from "../types/orientation";
import { ROTATION_TOLERANCES } from "../constants";

type OrientationDisplayProps = {
  orientation: Orientation;
  targetOrientation: Orientation;
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

  const hasAnyMessage = yawMessage || pitchMessage || rollMessage;

  return (
    <div className="orientation-panel">
      <h2 className="orientation-title">Orientation du visage</h2>

      <div className="orientation-values">
        <div className="orientation-block">
          <div className="orientation-label">Yaw (horiz.)</div>
          <strong>{yaw?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            {" "}
            / cible {targetYaw?.toFixed(1) ?? "..."}°
          </span>
        </div>

        <div className="orientation-block">
          <div className="orientation-label">Pitch (vert.)</div>
          <strong>{pitch?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            {" "}
            / cible {targetPitch?.toFixed(1) ?? "..."}°
          </span>
        </div>

        <div className="orientation-block">
          <div className="orientation-label">Roll (latéral)</div>
          <strong>{roll?.toFixed(1) ?? "..."}°</strong>
          <span className="orientation-target">
            {" "}
            / cible {targetRoll?.toFixed(1) ?? "..."}°
          </span>
        </div>
      </div>

      <div className="orientation-messages">
        {hasAnyMessage ? (
          <>
            {yawMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-yaw" />
                {yawMessage}
              </div>
            )}
            {pitchMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-pitch" />
                {pitchMessage}
              </div>
            )}
            {rollMessage && (
              <div className="orientation-message">
                <span className="orientation-dot orientation-dot-roll" />
                {rollMessage}
              </div>
            )}
          </>
        ) : (
          <div className="orientation-message orientation-message-ok">
            <span className="orientation-dot orientation-dot-ok" />
            Parfait, ne bougez plus. Capture en cours…
          </div>
        )}
      </div>
    </div>
  );
}

function getYawMessage(
  yaw: number | undefined,
  targetYaw: number | undefined
): string | null {
  if (yaw === undefined || targetYaw === undefined) return null;
  const delta = yaw - targetYaw;

  if (Math.abs(delta) <= ROTATION_TOLERANCES.yaw) return null;
  if (delta > 0) return "Tournez légèrement la tête vers la gauche.";
  return "Tournez légèrement la tête vers la droite.";
}

function getPitchMessage(
  pitch: number | undefined,
  targetPitch: number | undefined
): string | null {
  if (pitch === undefined || targetPitch === undefined) return null;
  const delta = pitch - targetPitch;

  if (Math.abs(delta) <= ROTATION_TOLERANCES.pitch) return null;
  if (delta > 0) return "Baissez légèrement la tête.";
  return "Levez légèrement la tête.";
}

function getRollMessage(
  roll: number | undefined,
  targetRoll: number | undefined
): string | null {
  if (roll === undefined || targetRoll === undefined) return null;
  const delta = roll - targetRoll;

  if (Math.abs(delta) <= ROTATION_TOLERANCES.roll) return null;
  if (delta > 0) return "Inclinez légèrement la tête vers l'épaule droite.";
  return "Inclinez légèrement la tête vers l'épaule gauche.";
}

export default OrientationDisplay;
