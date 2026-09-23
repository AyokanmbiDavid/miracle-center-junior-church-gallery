import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ThrowbackCardItem from "./ThrowbackCardItem";
import ViewImage from "../ViewImage";
import { fetchThrowbacks, likeThrowback } from "../../../../axioscontroller";
import { Clock, Image as ImageIcon } from "@phosphor-icons/react";

export default function ThrowbackGrid() {
  const [loading, setLoading] = useState(true);
  const [throwbacks, setThrowbacks] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [viewingImage, setViewingImage] = useState({ show: false, src: "" });

  const loadThrowbacks = useCallback(async () => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await fetchThrowbacks();
      // Ensure we always fallback to a valid array to prevent rendering issues
      const dataArray = Array.isArray(response) ? response : response.data || [];
      setThrowbacks(dataArray);
    } catch (err) {
      console.error("Error fetching throwbacks:", err);
      setThrowbacks([]);
      setHasError(true);
      toast.error("Failed to load memory archives.", {
        style: { borderRadius: "12px", border: "1px solid #ef4444", background: "#fff", color: "#1c1917" },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThrowbacks();
  }, [loadThrowbacks]);

  // Handle Like Action Optimistically with Toast feedback
  const handleLike = async (id) => {
    if (!id) return;

    setThrowbacks((prev) =>
      prev.map((item) =>
        (item._id || item.id) === id
          ? { 
              ...item, 
              likes: (item.likes || 0) + 1, 
              userHasLiked: true 
            }
          : item
      )
    );

    try {
      await likeThrowback(id);
      toast.success("Memory liked!", {
        style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff", color: "#1c1917" },
        duration: 2000,
      });
    } catch (err) {
      console.error("Failed to like item:", err);
      // Revert optimistic update
      setThrowbacks((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { 
                ...item, 
                likes: Math.max(0, (item.likes || 1) - 1), 
                userHasLiked: false 
              }
            : item
        )
      );
      toast.error("Could not register like.");
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-stone-50 dark:bg-zinc-950 p-6 text-stone-800 dark:text-zinc-100 transition-colors duration-300">
      {viewingImage.show && (
        <ViewImage src={viewingImage.src} show={() => setViewingImage({ show: false, src: "" })} />
      )}

      {/* Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-stone-200 dark:border-zinc-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-amber-700 dark:text-amber-500 uppercase flex items-center gap-2">
            <Clock size={24} weight="duotone" /> Sanctuary Archives
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-1">
            Preserving milestones, special Sundays, and moments of fellowship.
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-10">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="h-64 bg-stone-200 dark:bg-zinc-900 rounded-xl animate-pulse" />
            ))
          ) : hasError ? (
            <div className="col-span-full py-16 text-center text-xs text-red-500 font-medium">
              Failed to load archives. Please check your connection.
            </div>
          ) : throwbacks.length === 0 ? (
            <div className="col-span-full py-16 text-center border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl">
              <ImageIcon size={32} className="mx-auto text-stone-400 mb-2" />
              <p className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                No throwback memories recorded yet.
              </p>
            </div>
          ) : (
            throwbacks.map((item, index) => {
              // SAFE KEY: Combines ID and index fallback to guarantee React maps every item without collision dropping
              const itemId = item._id || item.id || `throwback-${index}`;
              return (
                <ThrowbackCardItem
                  key={itemId}
                  item={item}
                  setViewingImage={setViewingImage}
                  onLike={handleLike}
                />
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}