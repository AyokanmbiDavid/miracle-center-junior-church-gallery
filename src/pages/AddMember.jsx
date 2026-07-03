import React, { useContext, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import Navbar from '../components/Navbar';
import { UserPlus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AddMemberPage = () => {
  const { currentclass, addnewmember } = useContext(all_provider);
  const [form, setForm] = useState({ surname: '', firstName: '', middleName: '', dateOfBirth: '', gender: 'male' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addnewmember(form.surname, form.firstName, form.middleName, form.dateOfBirth, form.gender);
    setForm({ surname: '', firstName: '', middleName: '', dateOfBirth: '', gender: 'male' });
  };

  return (
    <div className="min-h-screen bg-[#FDF8FF] text-[#1C1B1F] ">
      <Navbar />
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Block */}
        <div className="w-full py-6 flex items-center gap-3 justify-between max-sm:justify-center border-b border-[#CAC4D0]/30 mb-6">
          <div className="flex gap-3 items-center">
            <div className="p-2.5 bg-[#EADDFF] text-[#21005D] rounded-xl m3-elevation-1">
              <UserPlus size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1C1B1F]">Register New Child</h1>
              <p className="text-xs font-medium text-[#49454F] mt-0.5">
                Adding profile into: <span className="font-bold text-[#6750A4] capitalize">Class {currentclass}</span>
              </p>
            </div>
          </div> 
        </div>

        {/* M3 Style Form Panel */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col bg-[#F7F2FA] p-6 sm:p-8 rounded-[32px] m3-elevation-1 border border-[#CAC4D0]/20 gap-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -1 }} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-1 focus-within:border-2 focus-within:border-[#6750A4]">
              <label className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wider pl-1">Surname (Last Name)</label>
              <input type="text" required value={form.surname} onChange={e => setForm(p=>({...p, surname: e.target.value}))} className="w-full bg-transparent border-0 p-1 text-sm font-semibold outline-none focus:ring-0 text-[#1C1B1F]" />
            </motion.div>

            <motion.div whileHover={{ y: -1 }} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-1 focus-within:border-2 focus-within:border-[#6750A4]">
              <label className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wider pl-1">First Name</label>
              <input type="text" required value={form.firstName} onChange={e => setForm(p=>({...p, firstName: e.target.value}))} className="w-full bg-transparent border-0 p-1 text-sm font-semibold outline-none focus:ring-0 text-[#1C1B1F]" />
            </motion.div>
          </div>

          <motion.div whileHover={{ y: -1 }} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-1 focus-within:border-2 focus-within:border-[#6750A4]">
            <label className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wider pl-1">Middle Name (Optional)</label>
            <input type="text" value={form.middleName} onChange={e => setForm(p=>({...p, middleName: e.target.value}))} className="w-full bg-transparent border-0 p-1 text-sm font-semibold outline-none focus:ring-0 text-[#1C1B1F]" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div whileHover={{ y: -1 }} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-1 focus-within:border-2 focus-within:border-[#6750A4]">
              <label className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wider pl-1">Date of Birth</label>
              <input type="date" required value={form.dateOfBirth} onChange={e => setForm(p=>({...p, dateOfBirth: e.target.value}))} className="w-full bg-transparent border-0 p-1 text-sm font-semibold outline-none focus:ring-0 text-[#1C1B1F] cursor-pointer" />
            </motion.div>

            <motion.div whileHover={{ y: -1 }} className="p-4 bg-white rounded-2xl border border-gray-200 flex flex-col gap-1 focus-within:border-2 focus-within:border-[#6750A4]">
              <label className="text-[11px] font-bold text-[#6750A4] uppercase tracking-wider pl-1">Gender</label>
              <select value={form.gender} onChange={e => setForm(p=>({...p, gender: e.target.value}))} className="w-full bg-transparent border-0 p-1 text-sm font-semibold outline-none focus:ring-0 text-[#1C1B1F] cursor-pointer">
                <option value="male" className="bg-white">Male</option>
                <option value="female" className="bg-white">Female</option>
              </select>
            </motion.div>
          </div>

          <div className="w-full flex justify-center mt-4">
            <button type="submit" className="m3-state-layer h-12 px-8 bg-[#6750A4] font-semibold text-white rounded-full text-xs tracking-wider flex items-center justify-center gap-2 m3-elevation-1 hover:m3-elevation-2 active:m3-elevation-1 cursor-pointer transition-all w-full sm:w-72">
              <Sparkles size={14} />
              Save Registration Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberPage;
