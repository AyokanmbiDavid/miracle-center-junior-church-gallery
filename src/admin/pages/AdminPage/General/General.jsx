import React, { useState } from "react";
import { Plus, MagnifyingGlass, Users, IdentificationCard } from "@phosphor-icons/react";
import toast from "react-hot-toast";
import GeneralCardGrid from "./GeneralCardGrid.jsx";
import MemberEditModal from "./MemberEditModal.jsx";
import { createMember } from "../../../../axioscontroller";

const CLASSES = ["All Departments", "Toddlers", "Children", "Pre-teens", "Teenagers"];

export default function General() {
  const [selectedClass, setSelectedClass] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateMember = async (_, formData) => {
    try {
      await createMember(formData);
      toast.success("Soul added to Church Roster!", {
        style: { borderRadius: "12px", border: "1px solid #d97706", background: "#fff", color: "#1c1917" },
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Create member error:", error);
      toast.error("Failed to register member.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-stone-50 dark:bg-zinc-950 min-h-screen text-stone-800 dark:text-zinc-100 font-sans antialiased transition-colors duration-300">
      {/* Church Style Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-stone-200 dark:border-zinc-900">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-amber-700 dark:text-amber-500 uppercase flex items-center gap-2">
            <Users size={24} weight="duotone" /> Church Fold Roster
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium mt-1">
            Nurturing our heritage. Managing members, teachers, and dynamic children's ministries.
          </p>
        </div>

        <div className="flex items-center max-md:flex-col max-md:items-stretch gap-3 w-full md:w-auto">
          {/* Sanctuary Filter Field */}
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlass
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-600"
            />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 transition-colors shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-amber-700/10 active:scale-98"
          >
            <Plus size={16} weight="bold" /> Enroll New Soul
          </button>
        </div>
      </div>

      {/* Sanctuary Category Options */}
      <div className="flex gap-1.5 w-full p-1 mb-8 overflow-x-auto justify-start items-center rounded-xl bg-white dark:bg-zinc-900/40 border border-stone-200 dark:border-zinc-900/60 shadow-xs">
        {CLASSES.map((cls) => (
          <button
            key={cls}
            type="button"
            onClick={() => setSelectedClass(cls)}
            className={`px-3 py-1.5 text-xs font-semibold tracking-wide shrink-0 rounded-lg border transition-all cursor-pointer ${
              selectedClass === cls
                ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-zinc-800 dark:text-amber-400 dark:border-zinc-700 shadow-xs"
                : "text-stone-500 dark:text-zinc-400 border-transparent hover:text-stone-800 dark:hover:text-zinc-200"
            }`}
          >
            {cls}
          </button>
        ))}
      </div>

      {/* Core Registry Grid */}
      <GeneralCardGrid
        key={refreshTrigger}
        selectedClass={selectedClass}
        searchQuery={searchQuery}
      />

      {/* Entry Modal Overlay */}
      <MemberEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={null}
        onSave={handleCreateMember}
      />
    </div>
  );
}
