import React, { useState } from 'react';
import { MagnifyingGlass, Plus, CalendarBlank } from '@phosphor-icons/react';
import StatusCardGrid from './StatusCardGrid.jsx';
import StatusEditModal from './StatusEditModal.jsx';
import { createStatus } from '../../../../axioscontroller';
import toast from "react-hot-toast";

export default function Status() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateStatus = async (id, formData) => {
    try {
      await createStatus(formData);
      toast.success("Sunday broadcast published!", {
        style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff" },
      });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to publish status update.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-stone-50 dark:bg-zinc-950 min-h-screen text-stone-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-stone-200 dark:border-zinc-900">
        <div>
          <h1 className="text-xl font-bold text-amber-700 dark:text-amber-500 uppercase flex items-center gap-2">
            <CalendarBlank size={24} weight="duotone" /> Sunday Broadcasts
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 font-medium">Publish service highlights and announcements for the fold.</p>
        </div>

        <div className="flex items-center gap-3 max-md:w-full">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Filter broadcasts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-stone-800 dark:text-zinc-100 focus:outline-none focus:border-amber-600"
            />
          </div>
          <button type="button" onClick={() => setIsCreateOpen(true)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl cursor-pointer">
            <Plus size={16} weight="bold" /> Broadcast New Status
          </button>
        </div>
      </div>

      <StatusCardGrid key={refreshKey} searchQuery={searchQuery} />
      <StatusEditModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleCreateStatus} />
    </div>
  );
}
