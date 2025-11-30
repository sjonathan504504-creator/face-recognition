import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import type { Orientation } from "../types/orientation";
import type { CapturedImage } from "../types/capturedImage";

interface UseFaceLandmakerProps {
  onOrientation: (orientation: Orientation) => void;
  //onScreenshot: (image: CapturedImage) => void;
  targetFPS: number;
  targetOrientation?: Orientation;
}

export function useFaceLandmarker({
  onOrientation,
  //onScreenshot,
  targetFPS = 30 /*default*/,
  targetOrientation = {} /**default undefined */,
}: UseFaceLandmakerProps) {
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animationFrameRef = useRef(0); /* for cleaning at the end */
  const lastRenderTimeStamp = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const renderLoop = useCallback(
    function loop(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
      const now = performance.now();
      const interval = 1000 / targetFPS; /* interval between frames in ms */
      if (now - lastRenderTimeStamp.current < interval) {
        /* requestAnimationFrame guarantees 60 FPS between frames => not too scandalous loop */

        animationFrameRef.current = requestAnimationFrame(() =>
          loop(video, canvas)
        );
        return;
      }
      lastRenderTimeStamp.current = now;

      if (!faceLandmarkerRef.current) return; /* landmarker not ready */
      if (video.readyState < video.HAVE_ENOUGH_DATA)
        return; /* video not ready */

      const ctx = canvas.getContext("2d");
      if (!ctx)
        return; /* verify ctx is OK ; but don't log in prod, we're in a loop ! */

      canvas.width = video.videoWidth; //video.width;
      canvas.height = video.videoHeight; //video.height;

      ctx.drawImage(video, 0, 0);
      const results = faceLandmarkerRef.current.detectForVideo(video, now);

      //console.log(results);

      const orientation: Orientation =
        calculateHeadOrientationFromMatrix(results);

      // if (isOrientationCloseToTarget(orientation, targetOrientation)) {
      //   onScreenshot({
      //     image: canvas.toDataURL("image/png"),
      //     name: now.toString(),
      //     orientation,
      //   });
      // }

      onOrientation(orientation); /**relay information to parent component */

      animationFrameRef.current = requestAnimationFrame(() =>
        renderLoop(video, canvas)
      );
    },
    [onOrientation, targetFPS]
  );

  const startRender = useCallback(
    (video: HTMLVideoElement, canvas: HTMLCanvasElement) =>
      renderLoop(video, canvas),
    [renderLoop]
  );

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
              /**TODO : remplacer par le chemin en local */
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
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
    return { yaw: undefined, pitch: undefined }; //, roll: undefined };
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
  targetOrientation: Orientation,
  tolerance: number = 1 // degrés de tolérance => à mette à part en variable globale ?
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
    Math.abs(orientation.yaw - targetOrientation.yaw) <= tolerance &&
    Math.abs(orientation.pitch - targetOrientation.pitch) <= tolerance &&
    Math.abs(orientation.roll - targetOrientation.roll) <= tolerance
  );
}

/**
 * Calcule yaw et pitch à partir de la matrice de transformation MediaPipe FaceLandmarker ; NB : ne marche pas trop pour le pitch
 */
// const calculateHeadOrientation = (results: FaceLandmarkerResult) => {
//   const landmarks = results.faceLandmarks?.[0];
//   if (!landmarks) {
//     console.log("undefined yaw and pitch");
//     return { yaw: undefined, pitch: undefined };
//   }

//   const RAD_TO_DEG = 180 / Math.PI;

//   // Landmarks utiles (indices MediaPipe)
//   const LEFT_EYE = 33;
//   const RIGHT_EYE = 263;
//   const NOSE_TIP = 1;
//   const LEFT_CHEEK = 234;
//   const RIGHT_CHEEK = 454;

//   const nose = landmarks[NOSE_TIP];
//   const leftEye = landmarks[LEFT_EYE];
//   const rightEye = landmarks[RIGHT_EYE];
//   const leftCheek = landmarks[LEFT_CHEEK];
//   const rightCheek = landmarks[RIGHT_CHEEK];

//   /** ---- Pitch (haut / bas) ----
//    * Angle vertical du nez par rapport à la ligne des yeux
//    */
//   const eyeCenterY = (leftEye.y + rightEye.y) / 2;
//   const dy = nose.y - eyeCenterY; // positif si le nez descend
//   const pitch = -Math.atan(dy * 4) * RAD_TO_DEG; // facteur ajustable pour sensibilité

//   /** ---- Yaw (gauche / droite) ----
//    * Basé sur la différence de profondeur entre les joues
//    * Si la joue gauche est plus proche (z plus petit) -> yaw positif (tourné à droite)
//    */
//   const dz = leftCheek.z - rightCheek.z;
//   const yaw = Math.atan(dz * 4) * RAD_TO_DEG;

//   return {
//     yaw: Math.max(-45, Math.min(45, yaw)),
//     pitch: Math.max(-30, Math.min(30, pitch)),
//   };
// };
