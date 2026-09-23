import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SquaresFour, Clock, ArchiveBoxIcon, IdentificationCard } from "@phosphor-icons/react";
import General from './General/General';
import Status from './Status/Status';
import Throwback from './Throwback/Throwback';
import { Wrench } from 'lucide-react';

const TABS = [
  { id: "General", label: "Class List Management", icon: IdentificationCard },
  { id: "Status", label: "Sunday Updates", icon: Clock },
  { id: "ThrowBack", label: "Throwbacks", icon: ArchiveBoxIcon },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="min-h-screen w-full p-2 dark:bg-gray-900 text-stone-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Top Level Nav bar Row Layout Container */}
      <div className="w-full pb-4 border-b border-stone-200 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col">
          <h1 className="text-sm font-bold flex gap-3 items-center uppercase tracking-widest text-amber-700 dark:text-amber-500">
            Sanctuary Admin Control <Wrench size={20}/> 
          </h1>
          <p className="text-[11px] text-amber-400/80  mt-0.5">
            Synchronized system registry access matrix.
          </p>
        </div>

        {/* Supabase Clean Horizontal Tab Picker System Matrix */}
        <nav className="flex gap-1 p-1 bg-white dark:bg-zinc-900 rounded-full border border-stone-200 dark:border-zinc-800 max-md:w-full overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="relative px-3.5 py-3.5 bg-transparent border-0 cursor-pointer outline-none flex items-center gap-2 rounded-full text-xs  font-medium transition-colors shrink-0 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="adminActiveTab"
                    className="absolute inset-0 bg-stone-100 dark:bg-zinc-800 rounded-full border border-stone-200/60 dark:border-zinc-700/60 shadow-xs z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                
                <span className={`relative z-10 flex items-center gap-2 transition-colors duration-150 ${
                  isActive 
                    ? "text-amber-800 dark:text-amber-400 font-bold" 
                    : "text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300"
                }`}>
                  <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Sanctuary Tab Panels Sub Execution Space */}
      <main className="w-full mt-4 relative transition-all duration-200">
        {activeTab === 'General' && <General />}
        {activeTab === 'Status' && <Status />}
        {activeTab === 'ThrowBack' && <Throwback />}
      </main>
    </div>
  );
}
