import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash, Clock, CheckCircle, PencilSimple, HeartStraight } from '@phosphor-icons/react';
import { likeStatus } from '../../../../axioscontroller';

export default function StatusCardItem({ item, setViewingImage, setEditingItem, setDeletingItem, setStatuses }) {
  const safeItem = item || {};
  const imageSrc = safeItem.src || "";
  const titleText = safeItem.title || safeItem.name || 'Sunday Broadcast';

  const handleLikeClick = async (id) => {
    try {
      setStatuses((prev) =>
        prev.map((i) => (i._id === id ? { ...i, likes: (i.likes || 0) + 1 } : i))
      );
      await likeStatus(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-64 shadow-xs"
    >
      <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
        {imageSrc ? <img src={imageSrc} alt={titleText} loading="lazy" className="w-full h-full object-cover" /> : <Clock size={36} weight="light" className="text-stone-300 dark:text-zinc-700" />}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded border backdrop-blur-md uppercase flex items-center gap-1 ${safeItem.isNewSunday ? 'bg-emerald-600/90 border-emerald-500' : 'bg-stone-900/80 dark:bg-zinc-800/90 border-stone-700'}`}>
            {safeItem.isNewSunday ? <CheckCircle size={10} weight="fill" /> : <Clock size={10} weight="fill" />}
            {safeItem.isNewSunday ? 'Active' : 'Archived'}
          </span>
        </div>
      </div>

      {/* SIGNATURE OVERLAY DESIGN */}
      <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2.5 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-bold text-stone-100 truncate tracking-tight">{titleText}</h3>
            <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider"><Clock size={12} /> Sanctuary Stream</p>
          </div>
          <button type="button" onClick={() => handleLikeClick(safeItem._id)} className="text-xs font-bold flex items-center bg-white border border-stone-200 text-stone-900 px-2 py-1 rounded-full gap-1.5 hover:scale-105 active:scale-95 shadow-xs">
            <span className="font-mono text-[11px]">{safeItem.likes || 0}</span>
            <HeartStraight className="text-red-500 fill-red-500" size={14} weight="fill" />
          </button>
        </div>

        <div className="flex w-full items-center justify-between text-xs text-stone-400/80 pt-2 border-t border-stone-800/50">
          <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-widest">{safeItem.createdAt ? new Date(safeItem.createdAt).toLocaleDateString() : 'Broadcast Log'}</span>
          <div className="flex items-center gap-0.5">
            <button type="button" onClick={() => setViewingImage({ show: true, src: imageSrc })} className="p-1.5 hover:text-amber-400 rounded-md hover:bg-stone-800/40 cursor-pointer"><Eye size={16} /></button>
            <button type="button" onClick={() => setEditingItem(safeItem)} className="p-1.5 hover:text-amber-400 rounded-md hover:bg-stone-800/40 cursor-pointer"><PencilSimple size={16} /></button>
            <button type="button" onClick={() => setDeletingItem(safeItem)} className="p-1.5 hover:text-red-400 rounded-md hover:bg-stone-800/40 cursor-pointer"><Trash size={16} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
