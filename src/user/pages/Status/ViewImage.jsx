import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from 'lucide-react';

const ViewImage = ({ src, show }) => {
  return (
    <div className="w-full h-full max-md:h-[1000px] max-sm:h-screen z-50 flex justify-center items-center fixed top-0 left-0 bg-black/70 backdrop-blur-sm rounded-2xl p-4">
      <motion.div
        initial={{ opacity: 0.3, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.3, scale: 0.8 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        className="relative bg-white dark:bg-gray-900 rounded-xl p-4 max-w-2xl w-full flex flex-col items-center border border-gray-200 dark:border-gray-800 shadow-2xl"
      >
        <button
          onClick={() => show({ show: false, src: '' })}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
        >
          <XIcon size={20} />
        </button>

        <img
          src={src}
          alt="Expanded View"
          className="object-contain w-full h-[400px] rounded-lg mt-6"
        />
      </motion.div>
    </div>
  );
};

export default ViewImage;