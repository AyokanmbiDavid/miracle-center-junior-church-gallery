
import { useEffect } from "react";
import { X } from "lucide-react";

export default function ImageViewer({ src, onClose }) {
  useEffect(() => {
    if (!src) return;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      className="image-viewer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        className="image-viewer-close"
        onClick={onClose}
        aria-label="Close image"
      >
        <X />
      </button>

      <img
        src={src}
        alt="Gallery preview"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
