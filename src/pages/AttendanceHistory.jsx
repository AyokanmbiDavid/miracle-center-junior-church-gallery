import React, { useContext, useEffect, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import Navbar from '../components/Navbar';
import { Download, Calendar, Trash2, Layers } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion, AnimatePresence } from 'framer-motion'; 

// 🎭 Condensed Framer Motion Variants
const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } } },
  card: {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 22 } },
    exit: { opacity: 0, x: -60, scale: 0.95, transition: { duration: 0.25, ease: "easeInOut" } }
  },
  header: { hidden: { opacity: 0, y: -20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } } }
};

const AttendanceHistoryPage = () => {
  const { currentclass, allAttendanceHistory, deleteattendance,fetchAllHistory } = useContext(all_provider);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    setHistoryList(Array.isArray(allAttendanceHistory) ? allAttendanceHistory : allAttendanceHistory ? [allAttendanceHistory] : []);
  }, [allAttendanceHistory]);

  const generatePDF = (record) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const roll = record.attroll?.find(c => c.theclass === currentclass)?.roll || [];
    const getCount = (status) => roll.filter(s => s.present === status).length;

    doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(33, 0, 93).text("ATTENDANCE REPORT", 14, 20);
    doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(100)
       .text(`Class Tier: ${currentclass.toUpperCase()} | Period: ${record.month} ${record.year} (${record.week})`, 14, 27)
       .text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    autoTable(doc, {
      startY: 38, head: [['Metric', 'Count']],
      body: [['Total Children ', roll.length.toString()], ['Total Present', getCount(true).toString()], ['Total Absent', getCount(false).toString()], ['Unmarked Rows', getCount(null).toString()]],
      theme: 'striped', headStyles: { fillColor: [103, 80, 164] }
    });

    const addTableSection = (title, data, color) => {
      doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(...color).text(title, 14, doc.lastAutoTable.finalY + 10);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14, head: [['S/N', 'Full Name', 'Status']], body: data,
        theme: 'grid', headStyles: { fillColor: color }, columnStyles: { 0: { cellWidth: 15 }, 2: { cellWidth: 30 } }
      });
    };

    addTableSection("General Roster Status Summary", roll.map((s, i) => [i + 1, s.title, s.present === true ? 'Present' : s.present === false ? 'Absent' : 'Unmarked']), [103, 80, 164]);

    const absent = roll.filter(s => s.present === false);
    if (absent.length > 0) addTableSection("Isolated Absentee Roll Summary", absent.map((s, i) => [i + 1, s.title, 'Absent']), [186, 26, 26]);

    doc.save(`Attendance_${currentclass== "6" ? "6 to 8" : currentclass == "4" ? "4 to 5":"9 to 12"}_${record.year}_${record.month}_${record.week.replace(/ /g, '_')}.pdf`);
  };

  return (
    <div className="bg-[#FDF8FF] h-screen overflow-y-auto text-[#1C1B1F]">
      <Navbar refreshfuc={fetchAllHistory}/>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        <motion.div variants={anim.header} initial="hidden" animate="show" className="w-full py-6 flex items-center gap-3 justify-between max-sm:justify-center border-b border-[#CAC4D0]/30 mb-6">
          <div className="flex gap-3 items-center">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} whileTap={{ scale: 0.95 }} className="p-2.5 bg-[#EADDFF] text-[#21005D] rounded-xl m3-elevation-1 cursor-pointer"><Calendar size={22} /></motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1C1B1F] capitalize">Attendance History</h1>
              <p className="text-xs font-medium text-[#49454F] mt-0.5">Browse past sheets and export detailed reporting sheets</p>
            </div>
          </div> 
        </motion.div>

        <motion.div variants={anim.container} initial="hidden" animate="show" className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {historyList.map((record) => {
              const roll = record.attroll?.find(c => c.theclass === currentclass)?.roll || [];
              const stats = [{ label: 'Total', val: roll.length, cls: 'text-[#1C1B1F]' }, { label: 'Present', val: roll.filter(s => s.present === true).length, cls: 'text-[#386A20]' }, { label: 'Absent', val: roll.filter(s => s.present === false).length, cls: 'text-[#BA1A1A]' }];

              return (
                <motion.div layout variants={anim.card} key={record._id || record.id} exit="exit" whileHover={{ scale: 1.012, y: -2, boxShadow: "0px 4px 12px rgba(103, 80, 164, 0.08)", borderColor: "rgba(103, 80, 164, 0.2)" }} className="w-full bg-[#F7F2FA] p-5 rounded-2xl border border-[#CAC4D0]/20 m3-elevation-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-200">
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1B1F] capitalize flex items-center gap-2"><Layers size={14} className="text-[#6750A4]" />{record.month} {record.year} — <span className="text-[#6750A4]">{record.week}</span></h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-[#49454F]">
                      {stats.map((st, i) => <React.Fragment key={st.label}>{i > 0 && <span className="h-3 w-px bg-[#CAC4D0]"></span>}<span>{st.label}: <span className={`font-bold ${st.cls}`}>{st.val}</span></span></React.Fragment>)}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <motion.button whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} onClick={() => generatePDF(record)} className="m3-state-layer h-10 px-4 bg-[#6750A4] text-white rounded-full text-xs font-semibold flex items-center gap-2 m3-elevation-1 hover:shadow-md cursor-pointer"><Download size={14} /> Download PDF </motion.button>
                    <motion.button whileHover={{ scale: 1.08, backgroundColor: "rgba(186, 26, 26, 0.18)" }} whileTap={{ scale: 0.88, rotate: -8 }} onClick={() => deleteattendance(record._id || record.id)} className="m3-state-layer h-10 w-10 bg-[#BA1A1A]/10 text-[#BA1A1A] rounded-full flex items-center justify-center cursor-pointer"><Trash2 size={15} /></motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {historyList.length === 0 && <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="w-full text-center py-16 bg-[#F7F2FA] border border-dashed border-[#CAC4D0] rounded-[32px] text-[#49454F] font-medium text-sm">No historical data logs match the active class selection profiles.</motion.div>}
        </motion.div>

      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
