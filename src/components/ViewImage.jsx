import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const ViewImage = ({ src, show }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Click backdrop to close */}
      <div 
        className="absolute inset-0" 
        onClick={() => show({ show: false, src: '' })} 
      />

      {/* Animated Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl p-4 max-w-3xl w-full flex flex-col items-center border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => show({ show: false, src: '' })}
          className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer z-20"
          aria-label="Close image preview"
        >
          <X size={20} />
        </button>

        {/* Full Image */}
        <div className="w-full max-h-[80vh] flex items-center justify-center mt-6">
          <img
            src={src}
            alt="Expanded View"
            className="object-contain max-h-[75vh] w-full rounded-xl"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default ViewImage