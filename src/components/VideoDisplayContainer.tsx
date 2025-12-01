import React, { useRef, useEffect } from "react";
import type { VideoDisplayRef } from "./VideoDisplayInternal";
import { useFaceLandmarker } from "../hooks/useFaceLandmarker";
import type { Orientation } from "../types/orientation";
import VideoDisplayInternal from "./VideoDisplayInternal";
import type { CapturedImage } from "../types/capturedImage";

interface VideoDisplayContainerProps {
  onOrientation: (orientation: Orientation) => void;
  onScreenshot: (image: CapturedImage) => void;
  targetOrientation: Orientation;
  targetFPS?: number;
}

function VideoDisplayContainer({
  onOrientation,
  onScreenshot,
  targetOrientation,
  targetFPS = 30,
}: VideoDisplayContainerProps) {
  const streamRef = useRef<MediaStream | null>(null);
  const videoDisplayRef = useRef<VideoDisplayRef>(null);
  const targetOrientationRef = useRef(targetOrientation);
  useEffect(() => {
    targetOrientationRef.current = targetOrientation; // update without re-render
  }, [targetOrientation]);

  const { isReady, startRender } = useFaceLandmarker({
    onOrientation,
    onScreenshot,
    targetFPS,
    targetOrientation,
    videoDisplayRef,
  });

  useEffect(() => {
    if (!isReady) return;

    navigator.mediaDevices
      .getUserMedia({
        video: { width: 480, height: 480 },
      }) /**TODO : mettre une const commune de tailles pour video et canvas */
      .then((stream) => {
        streamRef.current = stream;
        if (videoDisplayRef.current?.getVideo()) {
          videoDisplayRef.current.getVideo()!.srcObject = stream;
          videoDisplayRef.current.getVideo()!.play();
        }
      })
      .catch((e) =>
        console.error("Error while initializing video display : ", e)
      );
  }, [isReady]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (isReady && startRender && videoDisplayRef.current) {
      const video = videoDisplayRef.current.getVideo();
      const canvas = videoDisplayRef.current.getCanvas();
      if (video && canvas) {
        console.log("startRender begin");
        startRender();
        console.log("startRender end");
      }
    }
  }, [isReady, startRender]);

  return <VideoDisplayInternal ref={videoDisplayRef} />;
}

export default React.memo(VideoDisplayContainer);
