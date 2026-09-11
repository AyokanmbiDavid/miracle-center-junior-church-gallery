import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from "react-hot-toast";
import DeleteConfirmModal from './DeleteConfirmModal'; 
import ViewImage from '../ViewImage';
import StatusEditModal from './StatusEditModal.jsx';
import StatusCardItem from './StatusCardItem.jsx';
import { fetchStatuses, deleteStatus, updateStatus } from '../../../../axioscontroller';

export default function StatusCardGrid({ searchQuery = '' }) {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingItem, setDeletingItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingImage, setViewingImage] = useState({ show: false, src: '' });

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchStatuses();
      setStatuses(data || []);
    } catch (error) {
      toast.error("Failed to compile layout ledger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await deleteStatus(deletingItem._id);
      setStatuses((prev) => prev.filter((item) => item._id !== deletingItem._id));
      setDeletingItem(null);
      toast.success("Broadcast entry purged");
    } catch (error) {
      toast.error('Could not complete deletion.');
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      if (id) { 
        await updateStatus(id, formData);
        await fetchStatus();
        toast.success("Broadcast changes saved");
      }
    } catch (error) {
      toast.error("Failed to save changes.");
    }
  };

  const filteredStatuses = statuses.filter((item) => {
    const title = item?.title || item?.name || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      {viewingImage.show && <ViewImage src={viewingImage.src} show={() => setViewingImage({ show: false, src: '' })} />}
      <DeleteConfirmModal isOpen={!!deletingItem} onClose={() => setDeletingItem(null)} onConfirm={handleDelete} itemTitle={deletingItem?.title} />
      <StatusEditModal isOpen={!!editingItem} onClose={() => setEditingItem(null)} initialData={editingItem} onSave={handleUpdate} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStatuses.length > 0 ? (
            filteredStatuses.map((item) => (
              <StatusCardItem key={item._id} item={item} setViewingImage={setViewingImage} setEditingItem={setEditingItem} setDeletingItem={setDeletingItem} setStatuses={setStatuses} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900/20 border border-dashed border-stone-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-semibold text-stone-400 dark:text-zinc-500 uppercase tracking-widest">No active broadcasts found matching filters.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
