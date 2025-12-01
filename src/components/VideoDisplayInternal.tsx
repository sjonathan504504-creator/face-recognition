import React, { useRef, forwardRef, useImperativeHandle } from "react";
import "../styles/VideoDisplayInternal.css";

export interface VideoDisplayRef {
  getVideo: () => HTMLVideoElement | null;
  getCanvas: () => HTMLCanvasElement | null;
}

const VideoDisplayInternal = forwardRef<VideoDisplayRef, object>(
  (props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        getVideo: () => videoRef.current,
        getCanvas: () => canvasRef.current,
      }),
      []
    );

    return (
      <div className="video-display-container">
        <div className="video-circle">
          <video ref={videoRef} muted playsInline className="video-element" />
          <canvas ref={canvasRef} className="canvas-element" />
        </div>
      </div>
    );
  }
);

export default React.memo(VideoDisplayInternal);
