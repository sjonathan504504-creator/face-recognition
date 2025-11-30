// // hooks/useFaceOrientation.ts
// import { useCallback, useState } from "react";
// import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

// export function useFaceOrientation(
//   targetYaw: number = 0,
//   targetPitch: number = 0
// ) {
//   const [yaw, setYaw] = useState(0);
//   const [pitch, setPitch] = useState(0);

//   const onLandmarks = useCallback((landmarks: NormalizedLandmark[]) => {
//     const newYaw = calculateYaw(landmarks);
//     const newPitch = calculatePitch(landmarks);
//     setYaw(newYaw);
//     setPitch(newPitch);
//   }, []);

//   return {
//     yaw,
//     pitch,
//     targetYaw,
//     targetPitch,
//     onLandmarks,
//   };
// }
