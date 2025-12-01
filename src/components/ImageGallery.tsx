import type { CapturedImage } from "../types/capturedImage";
import { ORIENTATION_PRESETS } from "../constants/api";
import "../styles/ImageGallery.css";

interface Props {
  images: CapturedImage[];
}

function ImageGallery({ images }: Props) {
  const total = ORIENTATION_PRESETS.length;
  const taken = images.length;

  return (
    <section className="gallery-container">
      {" "}
      <h2 className="gallery-title">
        {"Captures : "}
        <span className="progress-badge">
          {taken}/{total}
        </span>
      </h2>
      <ul className="gallery-grid">
        {" "}
        {Array.from({ length: total }, (_, index) => {
          const image = images[index];
          return (
            <li key={index} className="gallery-item">
              {image ? (
                <>
                  <img
                    src={image.image}
                    alt={`Capture ${index + 1}`}
                    className="gallery-image"
                  />
                  <div className="image-overlay">
                    <span className="image-number">#{index + 1}</span>
                  </div>
                </>
              ) : (
                <div className="image-placeholder">
                  <div className="image-overlay">
                    <span className="image-number">#{index + 1}</span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ImageGallery;
