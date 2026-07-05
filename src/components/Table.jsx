import { CheckCircle2, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { all_provider } from './ContextProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Table = ({ filter }) => {
  const { attendance, currentclass, markattendance } = useContext(all_provider);
  const [filtroll, setfiltroll] = useState([]);

  // Handle filtering, sorting, and base class changes in a unified hook
  useEffect(() => {
    if (!attendance || !attendance.attroll) {
      setfiltroll([]);
      return;
    }

    // Find the roster array for the active class group safely
    const baseClassData = attendance.attroll.find(item => item.theclass === currentclass);
    const targetRoll = baseClassData ? baseClassData.roll : [];

    let processedList = [];

    // 1. Filter roster array locally if a query string exists
    if (!filter || filter.trim() === '') {
      processedList = [...targetRoll]; // Create a shallow copy before sorting
    } else {
      const lowerFilter = filter.toLowerCase();
      processedList = targetRoll.filter(member => 
        member.title.toLowerCase().includes(lowerFilter)
      );
    }

    // 2. Sort alphabetically by title
    processedList.sort((a, b) => a.title.localeCompare(b.title));

    setfiltroll(processedList);
  }, [currentclass, attendance, filter]);

  return (
    <div className="w-full flex flex-col mt-2">
      {/* Table Header Layout Grid */}
      <div className="w-full flex justify-between gap-2 items-center">
        <div className="w-1/10 bg-gray-100 p-3 rounded-lg rounded-tl-3xl font-bold text-sm">
          S/N
        </div>
        <div className="w-6/10 max-sm:w-7/10 bg-gray-100 p-3 rounded-lg font-bold text-sm">
          Name
        </div>
        <div className="w-4/10 bg-gray-100 p-3 rounded-lg rounded-tr-3xl font-bold text-sm">
          Status
        </div>
      </div>

      {/* Roster Item Rows */}
      <div className="w-full flex flex-col gap-2 mt-1 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {filtroll.map((item, index) => {
            const isLastItem = index === filtroll.length - 1;

            return (
              <motion.div
                key={item.id}
                layout // Smoothly animates position changes during sorting/filtering
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ 
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8
                }}
                className="flex justify-between items-center gap-2"
              >
                <div className={`w-1/10 bg-blue-100 p-3 font-bold text-sm py-5 ${
                  isLastItem ? 'rounded-bl-3xl rounded-lg' : 'rounded-lg'
                }`}>
                  {index + 1}
                </div>

                <div className="w-6/10 max-sm:w-7/10 bg-blue-100 p-3 py-5 rounded-lg font-bold text-sm">
                  {item.title}
                </div>

                <div className={`w-4/10 bg-blue-100 p-3 font-bold text-sm ${
                  isLastItem ? 'rounded-br-3xl rounded-lg' : 'rounded-lg'
                }`}>
                  <div className="flex justify-center items-center gap-0.5">
                    {/* Mark Present Button */}
                    <button 
                      onClick={() => markattendance(item.id, true)}
                      className={`p-3 bg-green-300/70 rounded-l-2xl rounded-lg duration-300 cursor-pointer ${
                        item.present === true 
                          ? 'bg-green-600 text-white shadow-xl scale-105' 
                          : 'hover:bg-green-400 text-green-900'
                      }`}
                    >
                      <CheckCircle2 size={13}/>
                    </button>

                    {/* Mark Absent Button */}
                    <button 
                      onClick={() => markattendance(item.id, false)}
                      className={`p-3 bg-red-300/70 rounded-r-2xl rounded-lg duration-300 cursor-pointer ${
                        item.present === false 
                          ? 'bg-red-600 text-white shadow-xl scale-105' 
                          : 'hover:bg-red-400 text-red-900'
                      }`}
                    >
                      <X size={13}/>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Empty State Renders */}
      {filtroll.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full flex justify-center items-center bg-red-100 h-[300px] rounded-3xl border border-red-200 mt-2"
        >
          <span className="text-md font-bold text-red-600">
            No item found on data
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default Table;