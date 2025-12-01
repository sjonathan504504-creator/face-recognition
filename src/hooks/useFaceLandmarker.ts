import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import type { Orientation } from "../types/orientation";
import type { CapturedImage } from "../types/capturedImage";
import type { VideoDisplayRef } from "../components/VideoDisplayInternal";
import { MODEL_PATH, ROTATION_TOLERANCES } from "../constants";

interface UseFaceLandmarkerProps {
  onOrientation: (orientation: Orientation) => void;
  onScreenshot: (image: CapturedImage) => void;
  targetFPS: number;
  targetOrientation: Orientation;
  videoDisplayRef: React.RefObject<VideoDisplayRef | null>;
}

export function useFaceLandmarker({
  onOrientation,
  onScreenshot,
  targetFPS = 30 /*default*/,
  targetOrientation = {} /**default undefined */,
  videoDisplayRef,
}: UseFaceLandmarkerProps) {
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef(0); /* for cleaning at the end */
  const lastRenderTimeStamp = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const targetOrientationRef = useRef(targetOrientation);
  useEffect(() => {
    targetOrientationRef.current = targetOrientation; // update without re-render
  }, [targetOrientation]);

  const renderLoop = useCallback(
    function loop() {
      const video = videoDisplayRef.current?.getVideo();
      const canvas = videoDisplayRef.current?.getCanvas();

      if (!video || !canvas) {
        animationFrameRef.current = requestAnimationFrame(() => loop());
        return;
      }

      const now = performance.now();
      const interval = 1000 / targetFPS;
      if (now - lastRenderTimeStamp.current < interval) {
        animationFrameRef.current = requestAnimationFrame(() => loop());
        return;
      }
      lastRenderTimeStamp.current = now;

      if (!faceLandmarkerRef.current) {
        animationFrameRef.current = requestAnimationFrame(() => loop());
        return;
      }

      if (video.readyState < video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(() => loop());
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameRef.current = requestAnimationFrame(() => loop());
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      const results = faceLandmarkerRef.current.detectForVideo(video, now);

      const orientation: Orientation =
        calculateHeadOrientationFromMatrix(results);

      if (
        isOrientationCloseToTarget(orientation, targetOrientationRef.current)
      ) {
        console.log("taking screenshot");
        onScreenshot({
          image: canvas.toDataURL("image/png"),
          name: now.toString(),
          orientation,
        });
        /* prevent taking several captures at the same time, before targetOrientation gets properly updated */
        targetOrientationRef.current = {};
      }
      onOrientation(orientation); /**relay information to parent component */

      animationFrameRef.current = requestAnimationFrame(loop);
    },
    [
      onOrientation,
      onScreenshot,
      targetFPS,
      targetOrientationRef,
      videoDisplayRef,
    ]
  );

  const startRender = useCallback(() => {
    renderLoop();
  }, [renderLoop]);

  useEffect(() => {
    async function init() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
            },
            runningMode: "VIDEO",
            numFaces: 1,
            outputFacialTransformationMatrixes: true,
          }
        );
        setIsReady(true);
      } catch (e) {
        console.error("Error while initializing landmarker : ", e);
      }
    }
    init();

    return () => {
      /**clean */
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;
    };
  }, []);

  return { isReady, startRender };
}

const calculateHeadOrientationFromMatrix = (results: FaceLandmarkerResult) => {
  const m = results.facialTransformationMatrixes?.[0]?.data;

  if (!m || m.length !== 16) {
    return { yaw: undefined, pitch: undefined, roll: undefined };
  }

  const toDeg = (r: number) => r * (180 / Math.PI);

  return {
    yaw: toDeg(Math.atan2(m[2], m[10])),
    pitch: toDeg(Math.asin(-m[6])),
    roll: toDeg(Math.atan2(m[4], m[5])),
  } as const satisfies Orientation;
};

function isOrientationCloseToTarget(
  orientation: Orientation,
  targetOrientation: Orientation
): boolean {
  if (
    orientation.pitch === undefined ||
    orientation.yaw === undefined ||
    orientation.roll === undefined ||
    targetOrientation.pitch === undefined ||
    targetOrientation.yaw === undefined ||
    targetOrientation.roll === undefined
  ) {
    return false;
  }

  return (
    Math.abs(orientation.yaw - targetOrientation.yaw) <=
      ROTATION_TOLERANCES.yaw &&
    Math.abs(orientation.pitch - targetOrientation.pitch) <=
      ROTATION_TOLERANCES.pitch &&
    Math.abs(orientation.roll - targetOrientation.roll) <=
      ROTATION_TOLERANCES.roll
  );
}
