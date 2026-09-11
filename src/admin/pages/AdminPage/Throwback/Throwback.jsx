import React, { useState } from 'react';
import { MagnifyingGlass, Plus, ArchiveBoxIcon } from '@phosphor-icons/react';
import ThrowBackCardGrid from './ThrowBackCardGrid.jsx';
import ThrowbackFormModal from './ThrowbackFormModal.jsx';
import { createThrowback } from '../../../../axioscontroller';
import toast from "react-hot-toast";

export default function Throwback() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Triggers a network call to create a fresh throwback record
  const handleCreateThrowback = async (id, formData) => {
    try {
      await createThrowback(formData);
      toast.success("Memory saved successfully to the archives!", {
        style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff", color: "#1c1917" },
      });
      // Incrementing this key instantly triggers useEffect inside the grid list to fetch new items
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error creating throwback item:', error);
      toast.error("Failed to archive throwback memory.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-300">
      
      {/* Action Bar & Controls Panel Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-stone-200 dark:border-zinc-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-amber-700 dark:text-amber-500 uppercase flex items-center gap-2">
            <ArchiveBoxIcon size={24} weight="duotone" /> Sanctuary Memories
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-1">
            Archiving historical moments, retro activities, and milestone highlights of the fold.
          </p>
        </div>

        <div className="flex items-center max-md:flex-col max-md:items-stretch gap-3 w-full md:w-auto">
          {/* Query Filter Input field */}
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-600"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors shadow-xs"
              placeholder="Filter archives by description..."
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-amber-700/10 active:scale-98"
          >
            <Plus size={16} weight="bold" /> Archive New Memory
          </button>
        </div>
      </div>

      {/* Creation Modal Hooked up to handleCreateThrowback */}
      <ThrowbackFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreateThrowback}
      />

      {/* Grid Display Container Wrapper */}
      <div className="w-full mt-4">
        <ThrowBackCardGrid key={refreshKey} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
