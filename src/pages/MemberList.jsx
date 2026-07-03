import React, { useContext, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import Navbar from '../components/Navbar';
import { Clipboard, Edit3, Trash2, Download, Check, Users, ShieldAlert } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion';

const MemberListPage = () => {
  const { alldata, currentclass, updatemember, deletemember,fetchMembers} = useContext(all_provider);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (member) => {
    const text = `Name: ${member.lastname} ${member.firstname} ${member.middlename || ''}\nDOB: ${new Date(member.dob).toLocaleDateString()}\nGender: ${member.gender}\nClass: ${member.theclass}`;
    navigator.clipboard.writeText(text);
    setCopiedId(member._id || member.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (m) => {
    setEditingId(m._id || m.id);
    setEditForm({ surname: m.lastname, firstName: m.firstname, middleName: m.middlename, dateOfBirth: m.dob?.split('T'), gender: m.gender, active: m.active });
  };

  const handleUpdateSubmit = async (id) => {
    await updatemember(id, editForm);
    setEditingId(null);
  };

  const downloadRosterPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 0, 93);
    doc.text(`CLASS - CATEGORY ${currentclass.toUpperCase() == "6" ? "6 to 8" : currentclass == "4" ? "4 to 5":"9 to 12"}`, 14, 20);
    
    const body = alldata.map((m, idx) => [
      idx + 1,
      `${m.lastname} ${m.firstname} ${m.middlename || ''}`,
      m.gender,
      m.age || 'N/A',
    ]);

    autoTable(doc, {
      startY: 28,
      head: [['S/N', 'Full Name', 'Gender', 'Current Age']],
      body: body,
      headStyles: { fillColor: [103, 80, 164] },
      theme: 'striped'
    });

    doc.save(`Class_${currentclass == "6" ? "6 to 8" : currentclass == "4" ? "4 to 5":"9 to 12"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FF] text-[#1C1B1F] ">
      <Navbar refreshfuc={fetchMembers} />
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Top Control Block */}
        <div className="w-full py-6 flex flex-col sm:flex-row justify-between items-center border-b border-[#CAC4D0]/30 gap-4 mb-6">
          <div className="flex gap-3 items-center max-sm:text-center">
            <div className="p-2.5 bg-[#EADDFF] text-[#21005D] rounded-xl m3-elevation-1">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1C1B1F] capitalize">Children's Full List</h1>
              <p className="text-xs font-medium text-[#49454F] mt-0.5">Read,copy and edit child's info</p>
            </div>
          </div>
          <button onClick={downloadRosterPDF} className="m3-state-layer h-11 px-5 bg-[#386A20] hover:bg-[#2d5519] text-white font-bold text-xs rounded-full flex items-center gap-2 m3-elevation-1 hover:m3-elevation-2 transition cursor-pointer">
            <Download size={14} /> Download Full Class List PDF
          </button>
        </div>

        {/* Directory Stream */}
        <div className="flex flex-col gap-2.5">
          <AnimatePresence mode="popLayout">
            {alldata.map((member) => {
              const mId = member._id || member.id;
              const isEditing = editingId === mId;

              return (
                <motion.div 
                  key={mId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#F7F2FA] border border-[#CAC4D0]/20 rounded-2xl p-4 sm:p-5 m3-elevation-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-shadow hover:m3-elevation-2"
                >
                  {isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-xs">
                      <input type="text" value={editForm.surname} onChange={e=>setEditForm(p=>({...p, surname: e.target.value}))} className="p-3 py-4 bg-white border border-gray-200 rounded-xl outline-none font-semibold" placeholder="Surname" />
                      <input type="text" value={editForm.firstName} onChange={e=>setEditForm(p=>({...p, firstName: e.target.value}))} className="p-3 py-4 bg-white border border-gray-200 rounded-xl outline-none font-semibold" placeholder="First Name" />
                      <input type="text" value={editForm.middleName} onChange={e=>setEditForm(p=>({...p, middleName: e.target.value}))} className="p-3 py-4 bg-white border border-gray-200 rounded-xl outline-none font-semibold" placeholder="Middle Name" />
                      <input type="date" value={editForm.dateOfBirth} onChange={e=>setEditForm(p=>({...p, dateOfBirth: e.target.value}))} className="p-3 py-4 bg-white border border-gray-200 rounded-xl outline-none font-semibold" />
                      <select value={editForm.gender} onChange={e=>setEditForm(p=>({...p, gender: e.target.value}))} className="p-3 bg-white border border-[#79747E]/40 rounded-xl outline-none font-semibold">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <div className="flex gap-2 items-center sm:col-span-3 mt-2">
                        <button onClick={() => handleUpdateSubmit(mId)} className="m3-state-layer h-9 px-4 bg-[#6750A4] text-white font-bold rounded-full">Save Changes</button>
                        <button onClick={() => setEditingId(null)} className="m3-state-layer h-9 px-4 bg-[#E6E1E5] text-[#49454F] font-bold rounded-full">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h4 className="font-bold text-[#1C1B1F] text-sm capitalize">{member.lastname} {member.firstname} <span className="text-[#49454F] font-medium text-xs">{member.middlename}</span></h4>
                        <p className="text-[11px] text-[#49454F] font-bold mt-1 uppercase tracking-wider flex items-center gap-1.5">
                          Age: <span className="text-[#6750A4]">{member.age || 'N/A'} Yrs</span> | Gender: <span className="text-[#6750A4]">{member.gender}</span>
                        </p>
                      </div>
                      <div className="flex gap-1.5 w-full sm:w-auto justify-end">
                        <button onClick={() => handleCopy(member)} className="m3-state-layer h-9 w-9 bg-white border border-[#CAC4D0] rounded-full flex items-center justify-center text-[#49454F] cursor-pointer transition">
                          {copiedId === mId ? <Check size={14} className="text-[#386A20]" /> : <Clipboard size={14} />}
                        </button>
                        <button onClick={() => startEdit(member)} className="m3-state-layer h-9 w-9 bg-[#EADDFF] text-[#21005D] rounded-full flex items-center justify-center cursor-pointer transition">
                          <Edit3 size={14} />
                        </button>
                        <button onClick={() => deletemember(mId)} className="m3-state-layer h-9 w-9 bg-[#BA1A1A]/10 text-[#BA1A1A] rounded-full flex items-center justify-center cursor-pointer transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {alldata.length === 0 && (
            <div className="text-center py-16 bg-[#F7F2FA] border border-dashed border-[#CAC4D0] rounded-[32px] text-[#49454F] font-medium text-sm flex flex-col items-center gap-2">
              <ShieldAlert size={20} className="text-[#49454F]/60" />
              No child profiles found registered inside Class {currentclass} yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberListPage;
