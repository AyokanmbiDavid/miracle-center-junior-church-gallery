import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Trash, Clock, PencilSimple, HeartStraight } from '@phosphor-icons/react';
import DeleteConfirmModal from './DeleteConfirmModal'; 
import ViewImage from '../ViewImage';
import toast from "react-hot-toast";
import ThrowbackFormModal from './ThrowbackFormModal.jsx';
import { fetchThrowbacks, deleteThrowback, updateThrowback, likeThrowback } from '../../../../axioscontroller';

export default function ThrowBackCardGrid({ searchQuery = '' }) {
  const [throwbacks, setThrowbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingItem, setDeletingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingImage, setViewingImage] = useState({ show: false, src: '' });

  const fetchThrows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchThrowbacks();
      setThrowbacks(data || []);
    } catch (error) {
      console.error('Failed to fetch throwbacks:', error);
      toast.error("Failed to load throwbacks", {
        style: { borderRadius: "12px", border: "1px solid #ef4444", background: "#fff", color: "#1c1917" }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchThrows();
  }, [fetchThrows]);

  const handleDelete = async () => {
    if (deletingItem) {
      try {
        await deleteThrowback(deletingItem._id);
        setThrowbacks((prev) => prev.filter((item) => item._id !== deletingItem._id));
        setDeletingItem(null);
        toast.success("Throwback archive deleted!", {
          style: { borderRadius: "12px", border: "1px solid #3b82f6", background: "#fff", color: "#1c1917" }
        });
      } catch (error) {
        console.error('Failed to delete throwback:', error);
        toast.error('Could not delete item.');
      }
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      if (id) { 
        await updateThrowback(id, formData);
        await fetchThrows();
        toast.success("Throwback memory updated!", {
          style: { borderRadius: "12px", border: "1px solid #22c55e", background: "#fff", color: "#1c1917" }
        });
      }
    } catch (error) {
      console.error('Failed to update throwback:', error);
      toast.error("Failed to save changes.");
    }
  };

  const handleLike = async (id) => {
    try {
      setThrowbacks((prev) =>
        prev.map((item) => (item._id === id ? { ...item, likes: (item.likes || 0) + 1 } : item))
      );
      await likeThrowback(id);
    } catch (error) {
      console.error("Failed to increment like metrics:", error);
    }
  };

  const filteredThrowbacks = throwbacks.filter((item) => {
    return (item.description || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const closeImageViewer = () => setViewingImage({ show: false, src: '' });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-64 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Lightbox Preview */}
      {viewingImage.show && (
        <ViewImage src={viewingImage.src} show={closeImageViewer} />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        itemTitle={deletingItem?.description || 'Throwback post'}
      />

      {/* Edit Form Modal */}
      <ThrowbackFormModal
        isOpen={!!editingItem} 
        onClose={() => setEditingItem(null)}
        initialData={editingItem}
        onSave={handleUpdate}
      />

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredThrowbacks.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-64 shadow-xs"
            >
              {/* Photo Viewport Header */}
              <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
                <img
                  src={item.src}
                  alt={item.description || "Throwback"}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              </div>

              {/* Absolute Throwback Overlay Container */}
              <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2.5 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-stone-100 truncate tracking-tight">
                      {item.description || 'Throwback Memory'}
                    </h3>
                    <p className="text-[10px] font-mono text-stone-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                      <Clock size={12} /> Archive Record
                    </p>
                  </div>
                  
                  {/* Hearts/Likes Badge */}
                  <button 
                    type="button"
                    onClick={() => handleLike(item._id)}
                    className="text-xs font-bold flex items-center bg-white border border-stone-200 text-stone-900 px-2 py-1 rounded-full gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="font-mono text-[11px]">{item.likes || 0}</span>
                    <HeartStraight className="text-red-500 fill-red-500" size={14} weight="fill" />
                  </button>
                </div>

                {/* Sub Action controls row footer block */}
                <div className="flex w-full items-center justify-between text-xs text-stone-400/80 pt-2 border-t border-stone-800/50">
                  <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                    {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setViewingImage({ show: true, src: item.src })}
                      className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                      title="Preview Media"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                      title="Modify Memory"
                    >
                      <PencilSimple size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingItem(item)}
                      className="p-1.5 text-stone-400 hover:text-red-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                      title="Delete Memory"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredThrowbacks.length === 0 && (
        <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900/20 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl shadow-xs">
          <p className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
            No archived memories found matching this query.
          </p>
        </div>
      )}
    </div>
  );
}
