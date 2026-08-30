import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Baby, Smiley, User, CaretDown, Check,UsersIcon } from '@phosphor-icons/react'

const ageGroups = [
  { id: 'All', label: 'All class', icon: UsersIcon },
  { id: 'toddlers', label: 'Toddlers', icon: Baby },
  { id: 'preteens', label: 'Pre-teens', icon: Smiley },
  { id: 'teenagers', label: 'Teenagers', icon: User },
]

const ClassDropDown = ({setclass}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(ageGroups[0])


  return (
      <div className="sticky right-3 top-5 max-w-[170px] z-50 max-sm:w-full">
        <div className="relative">
          {/* Dropdown Button */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-gray-200 dark:bg-gray-800/70 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold font-bold px-2 py-2 rounded-xl shadow-lg focus:outline-none transition-colors dark:hover:bg-zinc-800/80 hover:bg-zinc-200/80  cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {React.createElement(selectedGroup.icon, {
                size: 22,
                weight: 'fill',
                className: 'text-blue-500',
              })}
              <span className="font-bold text-xs">{selectedGroup.label}</span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <CaretDown size={18} className="text-zinc-400" />
            </motion.div>
          </button>

          {/* Animated Options Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl shadow-2xl overflow-hidden z-10"
              >
                <div className="flex flex-col gap-1">
                  {ageGroups.map((group) => {
                    const Icon = group.icon
                    const isSelected = selectedGroup.id === group.id

                    return (
                      <button
                        key={group.id}
                        onClick={() => {
                          setSelectedGroup(group)
                          setIsOpen(false)
                          setclass(group.label)
                        }}
                        className="relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer group outline-none"
                      >
                        {/* Sliding Background Pill */}
                        {isSelected && (
                          <motion.div
                            layoutId="active-dropdown-pill"
                            className="absolute inset-0 bg-blue-600 rounded-lg z-0"
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}

                        {/* Icon & Label */}
                        <div className="relative z-10 flex items-center gap-3">
                          <motion.div
                            animate={{ scale: isSelected ? 1.1 : 1 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Icon
                              size={20}
                              weight={isSelected ? 'fill' : 'regular'}
                              className={
                                isSelected
                                  ? 'text-white'
                                  : 'text-zinc-400 group-hover:text-zinc-200'
                              }
                            />
                          </motion.div>
                          <span
                            className={
                              isSelected
                                ? 'text-white font-semibold'
                                : 'text-zinc-300 group-hover:text-white'
                            }
                          >
                            {group.label}
                          </span>
                        </div>

                        {/* Active Checkmark */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative z-10 text-white"
                          >
                            <Check size={16} weight="bold" />
                          </motion.div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  )
}

export default ClassDropDown