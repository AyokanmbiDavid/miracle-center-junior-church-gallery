import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  CheckCircle, 
  CaretDown, 
  Check, 
  Users as UsersIcon, 
  PersonIcon
} from "@phosphor-icons/react";
import { Baby, User } from "lucide-react";

const filterOptions = [
  { id: "All", label: "All", icon: UsersIcon },
  { id: "Toddlers", label: "Toddlers", icon: Baby },
  { id: "Children", label: "Children", icon: PersonIcon },
  { id: "Pre-teen", label: "Pre-teen", icon: User },
  { id: "Teenagers", label: "Teenagers", icon: Clock },
];

export default function ClassDropDown2({ setFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(filterOptions[0]);

  return (
    <div className="relative max-w-[190px] z-50 max-sm:w-full">
      <div className="relative">
        {/* Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-stone-800 dark:text-zinc-100 font-bold p-4 rounded-full focus:outline-none transition-colors hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer"
        >
          <div className="flex items-center gap-2.5 truncate">
            {React.createElement(selectedOption.icon, {
              size: 18,
              weight: "fill",
              className: "text-amber-600 dark:text-amber-500 shrink-0",
            })}
            <span className="font-bold text-xs truncate">{selectedOption.label}</span>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <CaretDown size={16} className="text-stone-400 dark:text-zinc-500" />
          </motion.div>
        </button>

        {/* Dropdown Options Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 z-50 right-0 mt-2 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-1.5 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {filterOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedOption.id === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsOpen(false);
                        if (setFilter) {
                          setFilter(option.id);
                        }
                      }}
                      className="relative flex items-center justify-between w-full px-3 py-3.5 rounded-full text-xs font-medium transition-colors cursor-pointer group outline-none"
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-dropdown-pill"
                          className="absolute inset-0 bg-amber-600 dark:bg-amber-600 rounded-full z-0 shadow-xs"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-2.5">
                        <motion.div
                          animate={{ scale: isSelected ? 1.1 : 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Icon
                            size={16}
                            weight={isSelected ? "fill" : "regular"}
                            className={
                              isSelected
                                ? "text-white"
                                : "text-stone-400 dark:text-zinc-400 group-hover:text-stone-800 dark:group-hover:text-zinc-200"
                            }
                          />
                        </motion.div>
                        <span
                          className={
                            isSelected
                              ? "text-white font-semibold text-xs"
                              : "text-stone-600 dark:text-zinc-300 group-hover:text-stone-900 dark:group-hover:text-white text-xs"
                          }
                        >
                          {option.label}
                        </span>
                      </div>

                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="relative z-10 text-white"
                        >
                          <Check size={14} weight="bold" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}