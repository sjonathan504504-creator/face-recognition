import { useCallback, useState, useRef } from "react";
import VideoDisplay from "./VideoDisplay";
import type { CapturedImage } from "../types/capturedImage";
import OrientationDisplay from "./OrientationDisplay";
import type { Orientation } from "../types/orientation";
import ImageGallery from "./ImageGallery";

function MultiFaceRecord() {
  // const [yaw, setYaw] = useState<number | undefined>(undefined);
  // const [pitch, setPitch] = useState<number | undefined>(undefined);
  // const [targetYaw, setTargetYaw] = useState<number>(0);
  // const [targetPitch, setTargetPitch] = useState<number>(0);

  const [orientation, setOrientation] = useState<Orientation>({});
  const targetOrientationRef = useRef<Orientation>({});

  // ✅ Throttle : maximum 10 updates par seconde pour l'UI
  const lastUpdateRef = useRef(0);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  const addImage = useCallback((newImage: CapturedImage) => {
    setCapturedImages((prev) => [...prev, newImage]);
    targetOrientationRef.current = { yaw: 30, pitch: 30, roll: 30 };
  }, []);

  const handleOrientation = useCallback((orientation: Orientation) => {
    const now = performance.now();

    // ✅ Update l'UI maximum toutes les 1000ms (10 FPS)
    if (now - lastUpdateRef.current < 1000) {
      return; // Skip cette update
    }
    lastUpdateRef.current = now;

    // console.log("✅ NOUVELLE ORIENTATION:", orientation);
    // console.log("📊 handleOrientation called:", orientation);
    // console.log(
    //   "📊 Previous state - yaw:",
    //   orientation.yaw,
    //   "pitch:",
    //   orientation.pitch
    // );
    setOrientation(orientation);
    targetOrientationRef.current = { yaw: 0, pitch: 0, roll: 0 };
  }, []);

  return (
    <>
      <VideoDisplay
        //onScreenshot={addImage}
        onOrientation={handleOrientation}
        targetOrientation={targetOrientationRef}
      ></VideoDisplay>
      <OrientationDisplay
        orientation={orientation}
        targetOrientation={targetOrientation}
      />
      {/* <ImageGallery images={capturedImages} /> */}
    </>
  );
}

export default MultiFaceRecord;
