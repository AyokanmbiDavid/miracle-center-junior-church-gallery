import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquaresFourIcon,ArchiveBoxIcon,Pulse,CircleNotchIcon,LockKeyIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { gallery } from "../ContextProvider";

const tabs = [
  { id: "General", label: "General", icon: SquaresFourIcon,link:'/' },
  { id: "Status", label: "Status", icon: Pulse,link:'/dailystatus'  },
  { id: "ThrowBack", label: "Throwbacks", icon: ArchiveBoxIcon,link:'/throwback'  },
  { id: "AdminPage", label: "Admin Page", icon: LockKeyIcon,link:'/admin'  },
];




const Sidebar = () => {
  const navigation = useNavigate()
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [hoveredTab, setHoveredTab] = useState(null);
  const {refreshfunc} = useContext(gallery)

  async function reloadwindow () {
    navigation(0)
  }
  return (
    <div className="w-fit flex flex-col justify-between items-center max-h-10 ">
        <nav className="flex flex-col gap-3 p-3 rounded-xl w-fit ">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <
            Link
            to={tab.link}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
            className="relative p-2 bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center rounded-lg group"
          >
            {/* Sliding Active Background */}
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-blue-100 border-2 border-blue-500 dark:bg-blue-500/40 rounded-xl z-0"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 30,
                  mass: 0.8,
                }}
              />
            )}

            {/* Icon Animation: Scale, Color & Weight Transition */}
            <motion.div
              animate={{
                scale: isActive ? 1.15 : 1,
                rotate: isActive ? [0, -8, 8, 0] : 0, // Gentle wobbly entrance
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
                isActive ? "text-blue-500 dark:text-white" : "text-zinc-400 group-hover:text-zinc-200"
              }`}
            >
              <Icon
                size={18}
                weight={isActive ? "fill" : "regular"} // Seamless Phosphor weight switch
              />
            </motion.div>

            {/* Hover Tooltip */}
            <AnimatePresence>
              {hoveredTab === tab.id && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-full z-60 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-xl pointer-events-none z-20"
                >
                  {tab.label}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </nav>

    {/* refresh */}
    <div className="">
        <div 
        onClick={() => reloadwindow()}
        className="rounded-full p-2 border-gray-200 border-2 cursor-pointer dark:border-gray-700 dark:text-white">
            <CircleNotchIcon size={18} />
        </div>
    </div>
    </div>
  );
};

export default Sidebar;