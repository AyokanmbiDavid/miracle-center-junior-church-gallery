import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ViewImage = ({ src, show }) => {
  const handleClose = () => show({ show: false, src: '' });

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} 
        className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl p-2 flex flex-col items-center"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <img
          src={src}
          alt="Expanded Preview"
          className="object-contain max-h-[80vh] w-full rounded-xl"
        />
      </motion.div>
    </div>
  );
};

export default ViewImage;