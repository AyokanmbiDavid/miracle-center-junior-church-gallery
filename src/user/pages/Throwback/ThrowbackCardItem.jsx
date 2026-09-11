import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Heart, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ThrowbackCardItem({ item, setViewingImage, onLike }) {
  const safeItem = item || {};
  const imageSrc = safeItem.src || "";
  const descriptionText = safeItem.description || safeItem.googleDriveId || "Church Memory Archive";
  const itemId = safeItem._id || safeItem.id;
  const hasLiked = safeItem.userHasLiked || false;
  const isNewSunday = safeItem.isNewSunday ?? false;

  const handleDownload = (e) => {
    e.preventDefault();
    if (!imageSrc) return;

    const extension = imageSrc.toLowerCase().includes("png") ? "png" : "jpg";
    const filename = `church-throwback-${Date.now()}.${extension}`;

    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started!", {
      style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff", color: "#1c1917" },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-64 w-full shadow-xs"
    >
      {/* Media Viewport */}
      <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <img src={imageSrc} alt={descriptionText} loading="lazy" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
        ) : (
          <Clock size={36} className="text-stone-300 dark:text-zinc-700 stroke-[1.5]" />
        )}
        
        {/* Status Badge Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded border backdrop-blur-md uppercase flex items-center gap-1 ${isNewSunday ? 'bg-emerald-600/90 border-emerald-500' : 'bg-stone-900/80 dark:bg-zinc-800/90 border-stone-700'}`}>
            {isNewSunday ? 'Active' : 'Archived'}
          </span>
        </div>
      </div>

      {/* SIGNATURE OVERLAY DESIGN */}
      <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2.5 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-bold text-stone-100 truncate tracking-tight">{descriptionText}</h3>
            <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
              <Clock size={12} /> Sanctuary Stream
            </p>
          </div>

          <button 
            type="button" 
            onClick={() => onLike(itemId)} 
            className={`text-xs font-bold flex items-center border px-2 py-1 rounded-full gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer ${
              hasLiked 
                ? "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-400" 
                : "bg-white border-stone-200 text-stone-900 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            }`}
          >
            <span className="font-mono text-[11px]">{safeItem.likes || 0}</span>
            <Heart 
              className={`transition-colors ${hasLiked ? "text-red-500 fill-red-500" : "text-stone-400 hover:text-red-500"}`} 
              size={14} 
            />
          </button>
        </div>

        <div className="flex w-full items-center justify-between text-xs text-stone-400/80 pt-2 border-t border-stone-800/50">
          <span className="text-[9px] font-mono font-medium text-stone-500 uppercase tracking-widest">
            {safeItem.createdAt ? new Date(safeItem.createdAt).toLocaleDateString() : 'Broadcast Log'}
          </span>
          <div className="flex items-center gap-0.5">
            {imageSrc && (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-1.5 hover:text-amber-400 rounded-md hover:bg-stone-800/40 cursor-pointer text-stone-300 transition-colors"
                  title="Download Image"
                >
                  <Download size={16} />
                </button>
                <button 
                  type="button" 
                  onClick={() => setViewingImage({ show: true, src: imageSrc })} 
                  className="p-1.5 hover:text-amber-400 rounded-md hover:bg-stone-800/40 cursor-pointer text-stone-300 transition-colors"
                  title="View Image"
                >
                  <Eye size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}