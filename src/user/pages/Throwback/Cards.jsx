import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Heart, ShareNetwork, Sun, Moon, DownloadSimpleIcon,EyeIcon} from "@phosphor-icons/react";
import { gallery } from '../../../components/ContextProvider'
import ViewImage from "./ViewImage";

const CARDS_COUNT = 10;

export default function CardGrid({setrefreshf}) {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showmodal,setshowmodal] = useState({show:false,src:'mm'})

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {},[])


  return (
    <div >
      <div className="w-full mb-20 relative min-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-white transition-colors duration-300">

        {showmodal.show && <ViewImage src={showmodal.src} show={setshowmodal}/>}
        {/* Responsive Grid */}
        <div className="grid mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {loading
              ? Array.from({ length: CARDS_COUNT }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))
              : Array.from({ length: CARDS_COUNT }).map((_, index) => (
                  <ActualCard key={`card-${index}`} id={index + 1} setshowmodal={setshowmodal} />
                ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* --- SKELETON CARD COMPONENT --- */
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl flex flex-col gap-3 "
  >
    {/* Image Placeholder */}
    <motion.div
      className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image size={32} className="text-gray-400 dark:text-gray-700" />
    </motion.div>

    {/* Title Line */}
    <motion.div
      className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded-md"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
    />

    {/* Subtitle Line */}
    <motion.div
      className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded-md"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />

    {/* Footer Placeholder */}
    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-800/50">
      <motion.div
        className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.div
        className="w-16 h-4 bg-gray-200 dark:bg-gray-800 rounded-md"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </div>
  </motion.div>
);

/* --- LOADED CONTENT CARD --- */
const ActualCard = ({ id, setshowmodal}) => (
  <motion.div
    initial={{ opacity: 0, y: 12, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.35, ease: "easeOut" }}
    className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl flex flex-col gap-3 hover:border-gray-300 dark:hover:border-gray-700 transition-colors group"
  >
    {/* Image Preview */}
    <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden relative flex items-center justify-center">
      <img
        src={`https://picsum.photos/seed/${id + 50}/300/200`}
        alt={`Item ${id}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Content details */}
    <div className="p-3">
      <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Media Item #{id}</h3>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Uploaded 2 hours ago</p>
    </div>

    {/* Card Footer */}
    <div className="flex justify-between items-center mt-auto pt-2 p-2 border-t border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-400">
      <button className="p-1 hover:text-red-500 transition-colors cursor-pointer">
        <Heart size={18} />
      </button>
      <button className="p-1 hover:text-blue-500 transition-colors cursor-pointer">
        <DownloadSimpleIcon size={18} />
      </button>
      <button 
      onClick={() => {setshowmodal({show: true,src:`https://picsum.photos/seed/${id + 50}/300/200`});console.log(showmodal);
      }}
      className="p-1 hover:text-blue-500 transition-colors cursor-pointer">
        <EyeIcon size={18} />
      </button>
    </div>
  </motion.div>
);