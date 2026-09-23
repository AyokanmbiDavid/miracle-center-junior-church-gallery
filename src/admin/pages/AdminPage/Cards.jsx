import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Heart, DownloadSimple, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import ViewImage from "./ViewImage";
import EditModal from "./EditModal";
import DeleteConfirmModal from "./Status/DeleteConfirmModal";
import { deleteThrowback, fetchThrowbacks, likeThrowback } from "../../../axioscontroller";

export default function CardGrid({ selectedClass = "All class", searchQuery = "" }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [showmodal, setshowmodal] = useState({ show: false, src: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  // Fetch real data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchThrowbacks();
      setItems(data || []);
    } catch (error) {
      console.error("Error loading throwbacks:", error);
      toast.error(error?.message || "Failed to load throwbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedClass]);

  // Filter items matching class filter and live search query
  const filteredData = items.filter((item) => {
    const matchesClass =
      !selectedClass || selectedClass === "All class" || selectedClass === "All"
        ? true
        : (item.classis || item.className || item.class || "").toLowerCase() === selectedClass.toLowerCase();

    const matchesSearch = (item.title || item.name || item.description || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesClass && matchesSearch;
  });

  const handleSaveEdit = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        (item._id && item._id === updatedItem._id) || (item.id && item.id === updatedItem.id)
          ? updatedItem
          : item
      )
    );
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    const idToDelete = deletingItem._id || deletingItem.id;
    const toastId = toast.loading("Deleting throwback...");

    try {
      await deleteThrowback(idToDelete);
      setItems((prev) => prev.filter((item) => (item._id || item.id) !== idToDelete));
      toast.success("Throwback deleted successfully", { id: toastId });
      setDeletingItem(null);
    } catch (error) {
      console.error("Failed to delete throwback:", error);
      toast.error(error?.message || "Could not delete throwback item.", { id: toastId });
    }
  };

  const handleLike = async (itemToLike) => {
    const itemId = itemToLike._id || itemToLike.id;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) =>
        (item._id || item.id) === itemId
          ? { ...item, likes: (item.likes || 0) + 1 }
          : item
      )
    );

    try {
      const updatedItem = await likeThrowback(itemId);
      setItems((prev) =>
        prev.map((item) => ((item._id || item.id) === itemId ? updatedItem : item))
      );
    } catch (error) {
      toast.error("Failed to update like");
      loadData(); // Revert back to original server state on failure
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300 rounded-3xl mt-4">
      {/* Lightbox Modal */}
      {showmodal.show && (
        <ViewImage src={showmodal.src} show={setshowmodal} />
      )}

      {/* Edit Drawer/Modal */}
      <EditModal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        initialData={editingItem}
        type="throwback"
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        itemTitle={deletingItem?.title || deletingItem?.name || deletingItem?.description || "Throwback post"}
      />

      {/* Grid */}
      <div className="grid mb-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 max-w-7xl mx-auto p-4">
        <AnimatePresence mode="wait">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={`skeleton-${index}`} />
              ))
            : filteredData.map((item) => (
                <ActualCard
                  key={`card-${item._id || item.id}`}
                  data={item}
                  setshowmodal={setshowmodal}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => setDeletingItem(item)}
                  onLike={() => handleLike(item)}
                />
              ))}
        </AnimatePresence>
      </div>

      {!loading && filteredData.length === 0 && (
        <div className="w-full text-center py-16 text-gray-400 text-xs">
          No records found matching your filters.
        </div>
      )}
    </div>
  );
}

/* Skeleton Card Component */
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl flex flex-col gap-3">
    <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
      <Image size={32} className="text-gray-400 dark:text-gray-700" />
    </div>
    <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
    <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
  </div>
);

/* Loaded Content Card Component */
const ActualCard = ({ data, setshowmodal, onEdit, onDelete, onLike }) => {
  const imageSrc = data.src || data.image || data.imageUrl;
  const cardTitle = data.title || data.name || data.description || "Throwback Memory";
  const classNameValue = data.classis || data.className || data.class;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800/80 rounded-2xl flex flex-col overflow-hidden hover:shadow-lg dark:hover:border-gray-700 transition-all group"
    >
      <div className="w-full h-44 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img
          src={imageSrc || "/placeholder.jpg"}
          alt={cardTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {classNameValue && (
          <span className="absolute top-3 right-3 px-2.5 py-1 text-[10px] font-bold bg-black/60 text-white backdrop-blur-md rounded-lg">
            {classNameValue}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 dark:text-white font-semibold text-sm line-clamp-2">
          {cardTitle}
        </h3>
        <p className="text-gray-400 text-xs mt-1">
          {data.time || (data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "Recently added")}
        </p>
      </div>

      <div className="flex justify-between items-center mt-auto px-4 py-3 border-t border-gray-100 dark:border-gray-800/80 text-gray-400">
        <button
          type="button"
          onClick={onLike}
          className="flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Heart size={18} weight={data.likes > 0 ? "fill" : "regular"} />
          <span>{data.likes || 0}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 hover:text-amber-500 transition-colors cursor-pointer rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30"
            title="Edit Details"
          >
            <PencilSimple size={18} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30"
            title="Delete Item"
          >
            <Trash size={18} />
          </button>
          {imageSrc && (
            <a
              href={imageSrc}
              download
              target="_blank"
              rel="noreferrer"
              className="p-1.5 hover:text-blue-500 transition-colors cursor-pointer"
              title="Download"
            >
              <DownloadSimple size={18} />
            </a>
          )}
          <button
            type="button"
            onClick={() => setshowmodal({ show: true, src: imageSrc })}
            className="p-1.5 hover:text-blue-500 transition-colors cursor-pointer"
            title="View Image"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};