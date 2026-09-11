import React from "react";
import { motion } from "framer-motion";
import { User, Eye, PencilSimple, Trash } from "@phosphor-icons/react";

export default function MemberCard({ data, setshowmodal, onEdit, onDelete }) {
  // Fallbacks for direct links or server images
  const imageSrc = data.image;
  const memberName = data.name || data.title || "Unknown Member";
  const classNameValue = data.classis || data.className || data.class;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all"
    >
      <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 relative">
        {imageSrc ? (
          <img src={`${data.image}`} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User size={40} />
          </div>
        )}
        {classNameValue && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold bg-black/60 text-white backdrop-blur-md rounded-md">
            {classNameValue}
          </span>
        )}
      </div>
      

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-1">{memberName}</h3>
          {data.role && <p className="text-blue-500 font-medium text-xs mt-0.5">{data.role}</p>}
        </div>
      </div>

      <div className="flex justify-end items-center px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-gray-400 gap-1">
        <button onClick={onEdit} className="p-1.5 hover:text-amber-500" title="Edit">
          <PencilSimple size={16} />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:text-red-500" title="Delete">
          <Trash size={16} />
        </button>
        {imageSrc && (
          <button onClick={() => setshowmodal({ show: true, src: imageSrc })} className="p-1.5 hover:text-blue-500" title="View">
            <Eye size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}