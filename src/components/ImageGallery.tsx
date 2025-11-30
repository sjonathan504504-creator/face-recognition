import type { CapturedImage } from "../types/capturedImage";

interface Props {
  images: CapturedImage[];
}

function ImageGallery({ images }: Props) {
  return (
    <ul>
      {images.map((image) => (
        <li>
          <img src={image.image} key={image.image} />
        </li>
      ))}
    </ul>
  );
}

export default ImageGallery;
