import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SquaresFour, Clock, ArchiveBoxIcon, LockKey, ArrowClockwise } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import firstsvg from './1.svg'

const tabs = [
  { id: "General", label: "Fold Roster", icon: SquaresFour, link: "/" },
  { id: "Status", label: "Sunday Broadcasts", icon: Clock, link: "/dailystatus" },
  { id: "ThrowBack", label: "Sanctuary Archives", icon: ArchiveBoxIcon, link: "/throwback" },
  { id: "AdminPage", label: "Sanctuary Console", icon: LockKey, link: "/admin" },
];


const MobileBottombar = () => {  
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [hoveredTab, setHoveredTab] = useState(null);

      useEffect(() => {
        const currentTab = tabs.find((t) => t.link === location.pathname);
        if (currentTab) setActiveTab(currentTab.id);
      }, [location.pathname]);
    

  return (
    <div className=" w-dhw flex-col flex justify-between items-center py-2 bg-white dark:bg-gray-900 transition-colors duration-300">
         
         {/* Navigation Pipeline Link Group */}
         <nav className="flex gap-4 w-full px-2">
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
                     className="absolute inset-0 z-0 bg-green-100 rounded-full "
                       style={{ backgroundImage: `url(${firstsvg})`, backgroundRepeat: 'no-repeat', objectFit: 'cover' }}
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
   
               </Link>
             );
           })}
         </nav>
   
       </div>
  )
}

export default MobileBottombar
