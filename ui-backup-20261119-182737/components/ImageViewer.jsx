import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ImageViewer({ src, close }) {
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100] bg-black/90 p-4 flex items-center justify-center"
        >
          <button className="absolute top-5 right-5 text-white">
            <X size={28}/>
          </button>
          <img
            src={src}
            alt="Gallery preview"
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
