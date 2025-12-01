// MultiFaceRecord.tsx
import { useCallback, useState, useRef } from "react";
import type { CapturedImage } from "../types/capturedImage";
import type { Orientation } from "../types/orientation";

import VideoDisplayContainer from "./VideoDisplayContainer";
import OrientationDisplay from "./OrientationDisplay";
import ImageGallery from "./ImageGallery";

import { ORIENTATION_PRESETS } from "../constants";
import "../styles/MultiFaceRecord.css";

function MultiFaceRecord() {
  const [orientation, setOrientation] = useState<Orientation>({});
  const [targetOrientation, setTargetOrientation] = useState<Orientation>(
    ORIENTATION_PRESETS[0]
  );

  const lastUpdateRef = useRef(0);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  const addImage = useCallback((newImage: CapturedImage) => {
    setCapturedImages((prev) => {
      const newList = [...prev, newImage];
      if (newList.length < ORIENTATION_PRESETS.length) {
        setTargetOrientation(ORIENTATION_PRESETS[newList.length]);
      } else {
        setTargetOrientation({});
      }
      return newList;
    });
  }, []);

  const handleOrientation = useCallback((orientation: Orientation) => {
    const now = performance.now();
    if (now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;
    setOrientation(orientation);
  }, []);

  return (
    <div className="mfr-page">
      <header className="mfr-header">
        <h1 className="mfr-title">Reconnaissance faciale</h1>
      </header>

      <div className="mfr-block mfr-block-video">
        <VideoDisplayContainer
          onScreenshot={addImage}
          onOrientation={handleOrientation}
          targetOrientation={targetOrientation}
        />
      </div>

      <div className="mfr-block mfr-block-panel">
        <OrientationDisplay
          orientation={orientation}
          targetOrientation={targetOrientation}
        />
      </div>

      <div className="mfr-block mfr-block-panel">
        <ImageGallery images={capturedImages} />
      </div>
    </div>
  );
}

export default MultiFaceRecord;
