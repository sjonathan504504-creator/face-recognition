import React, { useRef, useEffect, useCallback } from "react";
// import {
//   FaceLandmarker,
//   FilesetResolver,
//   FaceLandmarkerOptions,
// } from "@mediapipe/tasks-vision";
import "../styles/VideoDisplay.css";
import { useFaceLandmarker } from "../hooks/useFaceLandmarker";
import type { Orientation } from "../types/orientation";
import type { CapturedImage } from "../types/capturedImage";

interface VideoDisplayProps {
  onOrientation: (orientation: Orientation) => void;
  // onScreenshot: (image: CapturedImage) => void;
  targetOrientation: Orientation;
}

function VideoDisplay({
  onOrientation,
  onScreenshot: onScreenshot,
  targetOrientation,
}: VideoDisplayProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { isReady, startRender } = useFaceLandmarker({
    onOrientation,
    //onScreenshot,
    targetFPS: 30,
    targetOrientation,
  });

  useEffect(() => {
    if (!isReady) return;

    navigator.mediaDevices
      .getUserMedia({
        video: { width: 640, height: 480 },
      }) /**TODO : mettre une const commune de tailles pour video et canvas */
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
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
  });

  const handleReadyToPlay = useCallback(() => {
    if (
      videoRef.current &&
      canvasRef.current &&
      startRender /* startRender chargé */
    ) {
      console.log("startRender begin");
      startRender(videoRef.current, canvasRef.current);
      console.log("startRender end");
    }
  }, [startRender]);

  // const handleReadyToPlay = useCallback(() => {
  //   console.log("📹 onLoadedMetadata triggered");
  //   console.log("Video state:", {
  //     readyState: videoRef.current?.readyState,
  //     currentTime: videoRef.current?.currentTime,
  //     paused: videoRef.current?.paused,
  //     videoWidth: videoRef.current?.videoWidth,
  //     videoHeight: videoRef.current?.videoHeight,
  //   });

  //   if (videoRef.current && canvasRef.current && startRender) {
  //     console.log("🎬 Calling startRender");
  //     startRender(videoRef.current, canvasRef.current);
  //   }
  // }, [startRender]);

  // Dans VideoDisplay, ajoutez cet useEffect
  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const handlePlay = () => console.log("▶️ Video PLAY event");
  //   const handlePause = () => console.log("⏸️ Video PAUSE event");
  //   const handleTimeUpdate = () => {
  //     console.log("⏱️ Video timeupdate:", video.currentTime);
  //   };

  //   video.addEventListener("play", handlePlay);
  //   video.addEventListener("pause", handlePause);
  //   video.addEventListener("timeupdate", handleTimeUpdate);

  //   return () => {
  //     video.removeEventListener("play", handlePlay);
  //     video.removeEventListener("pause", handlePause);
  //     video.removeEventListener("timeupdate", handleTimeUpdate);
  //   };
  // }, []);

  return (
    <div
      style={{
        width: "640px",
        height: "480px",
        borderRadius: "50%",
        overflow: "hidden",
        border: "3px solid #ccc",
        margin: "20px auto",
      }}
    >
      <video
        ref={videoRef}
        // style={{
        //   display: "none",
        //   //transform: "scaleX(-1)", /*inversion de la video pour voir comme dans un miroir, si on affichait directement la vidéo */
        // }} /** on se sert de la vidéo de manière indirecte, pour dessiner dans le canvas */
        muted
        playsInline /* video dans la page, pas en plein écran forcé ; inutile je pense, comme de tte façon on a display:none*/
        onLoadedMetadata={handleReadyToPlay}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: 640,
          height: 480,
          border: "1px solid #ddd",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

export default React.memo(
  VideoDisplay
); /* eviter les re-renders dans le composant parent */

// const webcamRef = useRef<Webcam>(null);
// const faceLandmarker = useFaceLandmarkerService();
// console.log("toto");
// // const takeCapture = useCallback(async (): Promise<void> => {
// const takeCapture = () => {
//   const video = webcamRef.current?.video;
//   if (!video) {
//     return;
//   }
//   const capture = webcamRef.current?.getScreenshot();
//   console.log(capture);
//   console.log("toto");
// };
// return (
//   <div className="lmj-webcam-capture">
//     <Webcam
//       audio={false}
//       ref={webcamRef}
//       screenshotFormat="image/jpeg"
//       width={640}
//       height={480}
//       onClick={() => takeCapture()}
//     />
//   </div>
// );
