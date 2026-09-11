import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, Smiley, User, CaretDown, Check, UsersIcon } from '@phosphor-icons/react';

const ageGroups = [
  { id: 'All', label: 'All class', icon: UsersIcon },
  { id: 'toddlers', label: 'Toddlers', icon: Baby },
  { id: 'preteens', label: 'Pre-teens', icon: Smiley },
  { id: 'teenagers', label: 'Teenagers', icon: User },
];

const ClassDropDown = ({ setclass }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(ageGroups[0]);

  return (
    <div className="relative w-full sm:w-48 z-30">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 text-gray-900 dark:text-white font-medium px-3.5 py-2 rounded-xl shadow-sm focus:outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-xs"
      >
        <div className="flex items-center gap-2.5">
          {React.createElement(selectedGroup.icon, {
            size: 18,
            weight: 'fill',
            className: 'text-blue-500',
          })}
          <span className="font-semibold">{selectedGroup.label}</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <CaretDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1.5 rounded-xl shadow-xl overflow-hidden z-40"
          >
            <div className="flex flex-col gap-1">
              {ageGroups.map((group) => {
                const Icon = group.icon;
                const isSelected = selectedGroup.id === group.id;

                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroup(group);
                      setIsOpen(false);
                      if (setclass) setclass(group.label);
                    }}
                    className="relative flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer outline-none"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-blue-50 dark:bg-blue-600/20 rounded-lg z-0"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    <div className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        size={16}
                        weight={isSelected ? 'fill' : 'regular'}
                        className={isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}
                      />
                      <span className={isSelected ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                        {group.label}
                      </span>
                    </div>

                    {isSelected && (
                      <Check size={14} weight="bold" className="relative z-10 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassDropDown;