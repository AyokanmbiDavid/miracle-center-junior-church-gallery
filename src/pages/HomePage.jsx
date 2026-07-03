import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { motion } from 'framer-motion'
import { CheckCircle, Percent, Search, Users } from 'lucide-react'
import Table from '../components/Table'
import { all_provider } from '../components/ContextProvider'

const HomePage = () => {
  const [searchfilter, setsearchfilter] = useState('');
  const { currentclass, attendance, attenddate, setattenddate, updateattendance } = useContext(all_provider);
  const [filtroll, setfiltroll] = useState([]);

  // Dynamic selector value assignment
  const changeattenddate = (type, val) => {
    setattenddate(prev => ({
      ...prev,
      [type]: val
    }));
  };

  // Safe data retrieval from backend data map schema (.attroll)
  useEffect(() => {
    if (!attendance || !attendance.attroll) {
      setfiltroll([]);
      return;
    }

    const currentClassData = attendance.attroll.find(item => item.theclass === currentclass);
    setfiltroll(currentClassData ? currentClassData.roll : []);
  }, [currentclass, attendance]);

  // Derived Performance Metrics
  const totalPresent = filtroll.filter(item => item.present === true).length;
  const totalCount = filtroll.length;
  const attendancePercentage = totalCount > 0 ? Math.floor((totalPresent / totalCount) * 100) : 0;

  return (
    <div>
      <Navbar />
      <div className="w-full max-sm:max-h-[700px] overflow-y-auto relative px-2">
        {/* Top Analytics Dashboard Cards */}        
        <div className="w-full flex max-lg:flex-col gap-3 py-5">
          <StatCard label="Total Number of Children" val={totalCount} icon={<Users size={22} />} delayanimate={0} tone="blue" />
          <StatCard label="Total Present" val={totalPresent} icon={<CheckCircle size={22} />} delayanimate={0.5} tone="green" />
          <StatCard 
            label="Attendance" 
            val={`${attendancePercentage}%`} 
            icon={<Percent size={20} />} 
            tone="purple" 
            progress={attendancePercentage} 
            delayanimate={0.7}
          />
        </div>

        {/* Filters and Inputs Toolbar Area */}
        <div className="w-full bg-transparent backdrop-blur-md sticky top-5 left-0 flex max-sm:flex-col gap-3 items-center justify-between z-10">
          <div className="p-2 relative max-sm:w-full bg-blue-100 rounded-3xl border border-blue-200">
            <Search size={20} className='absolute top-3 left-5 text-blue-900'/>
            <input 
              type="search" 
              placeholder='Search name here...'
              onChange={(e) => setsearchfilter(e.target.value)}
              className="bg-transparent border-0 focus:ring focus:ring-blue-100 pl-10 text-xs" 
            />
          </div>
          
          <button
            // Fixed: Standardized argument formatting. Optional chaining prevents errors if attendance is null.
            onClick={() => attendance?._id && updateattendance(attendance._id, attendance)}
            disabled={!attendance}
            className={`font-bold rounded-lg text-xs p-4 max-sm:w-full w-[400px] hover:scale-[1.02] hover:shadow-2xl duration-300 ${
              attendance ? 'bg-blue-600 text-white cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>

          <div className="flex gap-2 w-full sm:w-auto">
            <DateSelect type="year" onchange={changeattenddate} value={attenddate.year} options={['2026', '2025']} />
            <DateSelect type="month" onchange={changeattenddate} value={attenddate.month} options={['january','february','march','april','may','june','july','august','september','october','november','december']} />
            <DateSelect type="week" onchange={changeattenddate} value={attenddate.week} options={['week 1','week 2','week 3','week 4','week 5']} />
          </div>
        </div>

        {/* Main Attendance Sheet Grid */}
        <div className="h-[800px] mt-6">
          <Table filter={searchfilter} />
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ label, val, icon, tone, progress, delayanimate }) => {
  const tones = {
    blue: "bg-[#D3E3FD] text-[#041E49]",
    green: "bg-[#C4EED0] text-[#072711]",
    purple: "bg-[#EADDFF] text-[#21005D]"
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0.6 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: delayanimate, ease: 'easeInOut' }}
      className="bg-white p-6 w-full rounded-2xl duration-300 hover:scale-[1.04] hover:shadow-lg border border-gray-200 flex flex-col justify-between h-32 transition"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${tones[tone]}`}>{icon}</div>
        <div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-medium text-[#1F1F1F]">{val}</h3>
        </div>
      </div>
      {progress !== undefined && (
        <div className="w-full h-3 flex gap-0.5 items-center rounded-sm overflow-hidden mt-4 p-0.5">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progress}%` }}  
            className="h-full rounded-sm bg-blue-600 p-0.5" 
          />
          <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0"></div>
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${100 - progress}%` }}  
            className="h-full rounded-sm bg-blue-100 p-0.5" 
          />
        </div>
      )}
    </motion.div>
  );
};

const DateSelect = ({ value, onchange, options, type }) => (
  <div className="relative group grow sm:grow-0">
    <select 
      value={value} 
      onChange={(e) => onchange(type, e.target.value)} 
      className={`appearance-none w-full bg-blue-100 rounded-xl ${type === 'year' ? 'rounded-l-3xl' : type === 'week' ? 'rounded-r-3xl' : ''} pl-5 pr-5 p-4.5 text-xs font-medium capitalize border-0 outline-none transition-all cursor-pointer hover:bg-blue-200 duration-200`}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default HomePage;
