
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ZoomIn, Image as ImageIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ImageViewer({ src, onClose }) {
  useEffect(() => {
    if (!src) return;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [src, onClose]);

  return createPortal(
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#10221F]/90 p-3 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />

          {/* Viewer container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-6xl flex-col items-center"
          >
            {/* Top controls */}
            <div className="mb-3 flex w-full items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white backdrop-blur-xl">
                <ImageIcon size={16} />
                <span className="text-xs font-semibold tracking-wide">
                  Image preview
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close image preview"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-xl transition-all hover:rotate-90 hover:bg-white/20 active:scale-90"
              >
                <X size={22} />
              </button>
            </div>

            {/* Image */}
            <div className="relative flex min-h-0 w-full items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-black/20 p-1 shadow-2xl sm:rounded-[32px] sm:p-3">
              <img
                src={src}
                alt="Gallery preview"
                draggable="false"
                className="max-h-[78dvh] max-w-full select-none rounded-[18px] object-contain sm:rounded-[24px]"
              />
            </div>

            {/* Bottom hint */}
            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white/75 backdrop-blur-xl">
              <ZoomIn size={15} />
              <span className="text-xs font-medium">
                Press ESC or tap outside to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
