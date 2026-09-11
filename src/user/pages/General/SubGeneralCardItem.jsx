import React from "react";
import { motion } from "framer-motion";
import { Eye, DownloadSimple, Browser } from "@phosphor-icons/react";

export default function SubGeneralCardItem({ item, setLightbox, onDownload }) {
  const imageSrc = item.image || item.src || "";
  const nameText = item.name || item.title || "Unknown Soul";
  const classLabel = item.class || item.className || "General";
  const roleText = (item.role || "").toLowerCase();
  const isTeacher = roleText === "teacher" || item.isteacher;

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-64 shadow-xs">
      <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
        {imageSrc ? <img src={`${imageSrc}=s1000`} alt={nameText} loading="lazy" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" /> : <div className="text-xs font-mono text-stone-400">No Image</div>}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded border backdrop-blur-md tracking-wider uppercase ${isTeacher ? "bg-amber-600/90 border-amber-500" : "bg-stone-900/80 dark:bg-zinc-800/90 border-stone-700"}`}>
            {isTeacher ? "Teacher" : "Member"}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2.5 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-bold text-stone-100 truncate tracking-tight">{nameText}</h3>
            <p className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">{classLabel} Section</p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between text-xs text-stone-400/80 pt-2 border-t border-stone-800/50">
          <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-widest">Sanctuary</span>
          <div className="flex items-center gap-0.5">
            <a href={imageSrc} target="_blank" rel="noreferrer" className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors" title="See Image in Browser">
              <Browser size={16} />
            </a>
            <button type="button" onClick={() => onDownload(imageSrc, `${nameText.replace(/\s+/g, "_")}.jpg`)} className="p-1.5 text-stone-400 hover:text-emerald-400 rounded-md hover:bg-stone-800/40 transition-colors" title="Download Image Stream">
              <DownloadSimple size={16} />
            </button>
            <button type="button" onClick={() => setLightbox({ show: true, src: imageSrc })} className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors" title="View Lightbox Preview">
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}