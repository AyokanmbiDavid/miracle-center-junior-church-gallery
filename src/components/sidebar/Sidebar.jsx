import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquaresFour, Clock, ArchiveBoxIcon, LockKey, ArrowClockwise } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { id: "General", label: "Fold Roster", icon: SquaresFour, link: "/" },
  { id: "Status", label: "Sunday Broadcasts", icon: Clock, link: "/dailystatus" },
  { id: "ThrowBack", label: "Sanctuary Archives", icon: ArchiveBoxIcon, link: "/throwback" },
  { id: "AdminPage", label: "Sanctuary Console", icon: LockKey, link: "/admin" },
];

export default function Sidebar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState(null);

  // AUTOMATED ROUTE LISTENER: Syncs the active highlight if a user deep-links a page URL
  useEffect(() => {
    const currentTab = tabs.find((t) => t.link === location.pathname);
    if (currentTab) setActiveTab(currentTab.id);
  }, [location.pathname]);

  return (
    <div className="h-screen w-50 flex flex-col justify-between items-center py-5 bg-white dark:bg-gray-900 transition-colors duration-300">
      
      {/* Navigation Pipeline Link Group */}
      <nav className="flex flex-col gap-4 w-full px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Link
              to={tab.link}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              className="relative w-full p-2 bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center rounded-xl group transition-all duration-200 "
            >

              {/* Icon Animation Engine */}
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  rotate: isActive ? [0, -6, 6, 0] : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`relative z-10 flex gap-6 p-3 rounded-full w-full items-center justify-between transition-colors duration-150 ${
                  isActive ? "text-white dark:text-green-400 bg-[var(--green-lvl2)]" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                }`}
              > 
                <span className="text-xs fontbold">
                  {tab.label}
                </span>
                <Icon size={20} weight={isActive ? "fill" : "bold"} />
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Global Ledger Context Window Refresh Trigger */}
      <div className="px-2 w-full flex justify-center">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl p-3 border-2 border-gray-200 hover:border-green-500 text-gray-400 hover:text-green-500 bg-transparent cursor-pointer dark:border-gray-700 dark:text-gray-300 dark:hover:border-green-400 transition-all duration-150 active:translate-y-0.5 flex items-center justify-center"
          title="Refresh Ledger Sync"
        >
          <ArrowClockwise size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
