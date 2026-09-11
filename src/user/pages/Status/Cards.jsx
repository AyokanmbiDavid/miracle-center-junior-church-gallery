import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Clock, Heart, Download, Eye } from "lucide-react";
import toast from "react-hot-toast";
import ViewImage from "./ViewImage";
import Notification from "../../../components/Notification";
import EmptyState from "../../../components/EmptyState";
import { fetchStatuses, likeStatus } from "../../../axioscontroller";

export default function CardGrid({ filter = "All" }) {
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [viewingImage, setViewingImage] = useState({ show: false, src: "" });
  const [note, setnote] = useState(null);

  // Notification Banner Handler
  const notify = useCallback((state) => {
    setnote(state);
    const timer = setTimeout(() => {
      setnote(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch status records from backend API
  const loadStatuses = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await fetchStatuses();
      const dataArray = Array.isArray(response) ? response : response.data || [];
      setStatuses(dataArray);
      notify("success");
    } catch (err) {
      console.error("Error fetching statuses:", err);
      setStatuses([]);
      setHasError(true);
      notify("fail");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  // Optimistic Like Action Handler
  const handleLike = async (id) => {
    if (!id) return;

    setStatuses((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? { ...item, likes: (item.likes || 0) + 1, userHasLiked: true }
          : item
      )
    );

    try {
      await likeStatus(id);
    } catch (err) {
      console.error("Failed to like status item:", err);
      setStatuses((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, likes: Math.max(0, (item.likes || 1) - 1), userHasLiked: false }
            : item
        )
      );
      notify("fail");
    }
  };

  // Filter based on selected filter option ("All", "new", "old")
  const filteredStatuses = statuses.filter((item) => {
    if (filter === "new") {
      return item.isNewSunday === true;
    }
    if (filter === "old") {
      return item.isNewSunday === false;
    }
    return true; // "All"
  });

  return (
    <>
      {note && <Notification state={note} />}
      
      <div className="w-full relative min-h-screen bg-stone-50 dark:bg-zinc-950 p-6 text-stone-800 dark:text-zinc-100 transition-colors duration-300 rounded-3xl mt-4">
        {viewingImage.show && (
          <ViewImage src={viewingImage.src} show={() => setViewingImage({ show: false, src: "" })} />
        )}

        <div className="grid mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            ) : hasError ? (
              <div className="col-span-full py-16 text-center text-xs text-red-500 font-medium">
                Failed to load status records. Please try again later.
              </div>
            ) : filteredStatuses.length === 0 ? (
              <div className="col-span-full py-12 flex justify-center">
                <EmptyState />
              </div>
            ) : (
              filteredStatuses.map((item, index) => {
                const itemId = item._id || item.id;
                return (
                  <ThrowbackCardItem
                    key={itemId || `card-${index}`}
                    item={item}
                    onLike={handleLike}
                    setViewingImage={setViewingImage}
                  />
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/* Sub-component: Skeleton Loading Card */
const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-4 rounded-xl flex flex-col gap-3 h-64"
  >
    <motion.div
      className="w-full h-full bg-stone-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image size={32} className="text-stone-400 dark:text-zinc-700" />
    </motion.div>
  </motion.div>
);

/* Sub-component: Actual Rendered Item Card with Signature Overlay Design */
const ThrowbackCardItem = ({ item, setViewingImage, onLike }) => {
  const safeItem = item || {};
  const imageSrc = safeItem.src || "";
  const descriptionText = safeItem.googleDriveId || safeItem.title || "Sunday Status Banner";
  const itemId = safeItem._id || safeItem.id;
  const hasLiked = safeItem.userHasLiked || false;
  const isNewSunday = safeItem.isNewSunday ?? false;

  const handleDownload = (e) => {
    e.preventDefault();
    if (!imageSrc) return;

    const extension = imageSrc.toLowerCase().includes("png") ? "png" : "jpg";
    const filename = `sunday-status-${Date.now()}.${extension}`;

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
            {isNewSunday ? 'New Sunday' : 'Archived'}
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
            {safeItem.date ? new Date(safeItem.date).toLocaleDateString() : 'Broadcast Log'}
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
};