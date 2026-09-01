import React,{useState,useContext}from 'react'
import { gallery } from '../../../components/ContextProvider';
import { Link } from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion'
import { SquaresFourIcon,ArchiveBoxIcon,Pulse,CircleNotchIcon,LockKeyIcon } from "@phosphor-icons/react";
import { User, UserCheck } from 'lucide-react';
import CardGrid from './Cards';


const SubGeneral = () => {
    const tabs = [
      { id: "teachers", label: "Teachers", icon: User,link:'/' },
      { id: "members", label: "Members", icon: UserCheck,link:'/dailystatus'  },
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [hoveredTab, setHoveredTab] = useState(null);
    const {refreshfunc} = useContext(gallery)

  return (
    <>
       <div className="w-full rounded-2xl overflow-y-auto relative flex">
                  <div className="w-fit rounded-2xl  top-0 flex justify-between items-center ">
                          <nav className="flex  gap-3 p-3 rounded-xl w-fit ">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const isActive = activeTab === tab.id;
                  
                          return (
                            <
                              div
                              to={tab.link}
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              onMouseEnter={() => setHoveredTab(tab.id)}
                              onMouseLeave={() => setHoveredTab(null)}
                              className="relative  bg-transparent border-0 cursor-pointer outline-none flex items-center justify-center rounded-lg group">
                              {/* Sliding Active Background */}
                              {isActive && (
                                <motion.div
                                  layoutId="active"
                                  className="absolute inset-0 w-25 h-0 top-5 max-sm:top-7 bg-blue-100 border-2 rounded-xl border-blue-500 dark:bg-blue-500/40 z-0"
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
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className={`relative shrink-0 z-10 flex items-center  gap-2 pl-2 justify-center transition-colors duration-200 ${
                                  isActive ? "text-blue-500 dark:text-white" : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                                } border-l-2 border-gray-200 pr-5`}
                              >
                                <Icon
                                  size={18}
                                  weight={isActive ? "fill" : "regular"} // Seamless Phosphor weight switch
                                />
                                <h1 className="text-xs">
                                  {tab.label}
                                </h1>
                                
                              </motion.div>
                  
                            </div>
                          );
                        })}
                      </nav>
                  
                      </div>
        </div>

        <CardGrid/>
    </>
  )
}

export default SubGeneral
