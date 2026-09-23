import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import ViewImage from "../../../components/ViewImage";
import EmptyState from "../../../components/EmptyState";
import SubGeneralCardItem from "./SubGeneralCardItem.jsx";

export default function SubGeneralGrid({ data = [], loading, hasError, onDownload }) {
  const [lightbox, setLightbox] = useState({ show: false, src: "" });
  const safeData = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-64 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="col-span-full py-16 text-center text-xs font-mono font-semibold text-red-500 bg-white dark:bg-zinc-900/20 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl">
        Failed to load ledger records. Please refresh or try again later.
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="col-span-full py-12 flex justify-center bg-white dark:bg-zinc-900/10 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="w-full relative">
      {lightbox.show && <ViewImage src={lightbox.src} show={() => setLightbox({ show: false, src: "" })} />}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {safeData.map((item) => (
            <SubGeneralCardItem key={item._id || item.id} item={item} setLightbox={setLightbox} onDownload={onDownload} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}