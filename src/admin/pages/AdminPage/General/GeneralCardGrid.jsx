import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import ViewImage from "../ViewImage";
import MemberEditModal from "./MemberEditModal";
import MemberDeleteModal from "./MemberDeleteModal";
import { Eye, PencilSimple, Trash, User, BookOpen } from "@phosphor-icons/react";
import { fetchMembers, deleteMember, updateMember } from "../../../../axioscontroller";
import { motion, AnimatePresence } from "framer-motion";

export default function GeneralCardGrid({ selectedClass = "All Departments", searchQuery = "" }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [viewingImage, setViewingImage] = useState({ show: false, src: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const isGlobal = selectedClass === "All Departments" || selectedClass === "All class" || selectedClass === "All";
      const queryClass = isGlobal ? "" : selectedClass;
      const data = await fetchMembers(queryClass);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load ministry roster", {
        style: { borderRadius: "12px", border: "1px solid #ef4444", background: "#fff", color: "#1c1917" },
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [selectedClass]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredData = items.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(query) ||
      (item.class || "").toLowerCase().includes(query) ||
      (item.role || "").toLowerCase().includes(query)
    );
  });

  const handleSaveEdit = async (itemId, formData) => {
    try {
      if (itemId) {
        await updateMember(itemId, formData);
        toast.success("Roster record updated successfully", {
          style: { borderRadius: "12px", border: "1px solid #22c55e", background: "#fff", color: "#1c1917" },
        });
        loadData();
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Modification failed.");
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    const idToDelete = deletingItem._id || deletingItem.id;
    try {
      await deleteMember(idToDelete);
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== idToDelete));
      toast.success("Record removed from ledger", {
        style: { borderRadius: "12px", border: "1px solid #3b82f6", background: "#fff", color: "#1c1917" },
      });
      setDeletingItem(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Purge failure.");
    }
  };

  const closeImageViewer = () => setViewingImage({ show: false, src: "" });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-64 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-[400px]">
      {viewingImage.show && <ViewImage src={viewingImage.src} show={closeImageViewer} />}

      <MemberEditModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        initialData={editingItem}
        onSave={handleSaveEdit}
      />

      <MemberDeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        memberName={deletingItem?.name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredData.length > 0 ? (
            filteredData.map((item) => {
              const imageSrc = item.image || item.src;
              const memberName = item.name || "Unknown Soul";
              const classLabel = item.class || item.className || "General";
              const memberRole = item.role || "Member";
              const isTeacher = memberRole.toLowerCase() === "teacher";

              return (
                <motion.div
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-64 shadow-xs"
                >
                  {/* Image Framework viewport */}
                  <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={memberName}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <User size={36} weight="light" className="text-stone-300 dark:text-zinc-700" />
                    )}

                    {/* Church Theme Floating Tag Badges */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className={`px-2 py-0.5 text-[9px] font-bold text-white rounded border backdrop-blur-md tracking-wider capitalize ${
                        isTeacher 
                          ? 'bg-amber-600/90 border-amber-500' 
                          : 'bg-stone-900/80 dark:bg-zinc-800/90 border-stone-700 dark:border-zinc-700'
                      }`}>
                        {memberRole}
                      </span>
                    </div>
                  </div>

                  {/* FIXED THROWBACK DESIGN CONPIED: Absolute positioned footer layout container card design */}
                  <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2.5 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-sm font-bold text-stone-100 truncate tracking-tight">
                          {memberName}
                        </h3>
                        <p className="text-[10px] font-semibold text-amber-400 dark:text-amber-500 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                          <BookOpen size={12} weight="fill" /> {classLabel}
                        </p>
                      </div>
                    </div>

                    {/* Action button row layout */}
                    <div className="flex w-full items-center justify-between text-xs text-stone-400/80 pt-2 border-t border-stone-800/50">
                      <span className="text-[9px] font-semibold text-stone-500 uppercase tracking-widest">
                        Ministry Fold
                      </span>

                      <div className="flex items-center gap-0.5">
                        {imageSrc && (
                          <button
                            type="button"
                            onClick={() => setViewingImage({ show: true, src: imageSrc })}
                            className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                            title="Open Preview Lightbox"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 text-stone-400 hover:text-amber-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                          title="Modify Entry"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-stone-400 hover:text-red-400 rounded-md hover:bg-stone-800/40 transition-colors cursor-pointer"
                          title="Purge Entry"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900/20 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl shadow-xs">
              <p className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">
                No souls found registered under this category.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
