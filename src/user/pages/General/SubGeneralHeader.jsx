import React from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, User, UserCheck } from "@phosphor-icons/react";

const TABS = [
  { id: "teachers", label: "Teacher / Leaders", icon: User },
  { id: "members", label: "Members Fold", icon: UserCheck },
];

export default function SubGeneralHeader({ activeTab, setActiveTab, searchQuery, setSearchQuery, currentClass }) {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pb-4 border-b border-stone-200 dark:border-zinc-900">
      <div className="flex flex-col gap-1 max-sm:mb-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500">Department Overview</span>
        <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-white uppercase">{currentClass} Sanctuary</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <nav className="flex gap-1 p-1 bg-white dark:bg-zinc-900 rounded-xl border border-stone-200 dark:border-zinc-800 shadow-xs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className="relative px-3 py-1.5 bg-transparent border-0 cursor-pointer outline-none flex items-center gap-2 rounded-lg text-xs font-mono font-medium transition-colors">
                {isActive && ( <motion.div layoutId="subActiveTab" className="absolute inset-0 bg-stone-100 dark:bg-zinc-800 rounded-lg border border-stone-200/60 dark:border-zinc-700/60 shadow-xs z-0" transition={{ type: "spring", stiffness: 450, damping: 32 }} /> )}
                <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? "text-amber-800 dark:text-amber-400 font-bold" : "text-stone-400 dark:text-zinc-500 hover:text-stone-700 dark:hover:text-zinc-300"}`}>
                  <Icon size={14} weight={isActive ? "fill" : "regular"} /> {tab.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="relative w-full sm:w-56">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-600" />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Filter ${activeTab}...`} className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-stone-800 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-600 focus:outline-none" />
        </div>
      </div>
    </div>
  );
}