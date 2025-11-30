import type { Orientation } from "./orientation";

export interface CapturedImage {
  image: string;
  name?: string;
  orientation?: Orientation;
}
