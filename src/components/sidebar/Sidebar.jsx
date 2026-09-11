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
    <div className="h-screen w-16 flex flex-col justify-between items-center py-5 bg-white dark:bg-gray-900 transition-colors duration-300">
      
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
              className="relative p-3 w-full bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center rounded-xl group transition-all duration-200 active:translate-y-0.5"
            >
              {/* Sliding 3D Active Pill Badge Layer */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-green-50 border-2 border-green-500 dark:bg-green-500/20 dark:border-green-400 rounded-2xl z-0"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                    mass: 0.8,
                  }}
                />
              )}

              {/* Icon Animation Engine */}
              <motion.div
                animate={{
                  scale: isActive ? 1.12 : 1,
                  rotate: isActive ? [0, -6, 6, 0] : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`relative z-10 flex items-center justify-center transition-colors duration-150 ${
                  isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200"
                }`}
              >
                <Icon size={20} weight={isActive ? "fill" : "bold"} />
              </motion.div>

              {/* Hover Tooltip Overlay */}
              <AnimatePresence>
                {hoveredTab === tab.id && (
                  <motion.div
                    initial={{ opacity: 0, x: -6, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-full z-50 ml-3 px-3 py-1.5 bg-gray-900 dark:bg-gray-800 text-white text-[11px] font-black uppercase tracking-wider rounded-xl shadow-xl pointer-events-none border-2 border-gray-700 dark:border-gray-600 whitespace-nowrap"
                  >
                    {tab.label}
                  </motion.div>
                )}
              </AnimatePresence>
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
