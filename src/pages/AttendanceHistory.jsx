import React, { useContext, useEffect, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import Navbar from '../components/Navbar';
import { Download, Calendar, Trash2, Layers } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AttendanceHistoryPage = () => {
  const { currentclass, attendance, deleteattendance } = useContext(all_provider);
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    if (Array.isArray(attendance)) {
      setHistoryList(attendance);
    } else if (attendance) {
      setHistoryList([attendance]);
    } else {
      setHistoryList([]);
    }
  }, [attendance]);

  const generatePDF = (record) => {
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const classData = record.attroll?.find(c => c.theclass === currentclass) || { roll: [] };
    const roll = classData.roll || [];
    
    const totalChildren = roll.length;
    const totalPresent = roll.filter(s => s.present === true).length;
    const totalAbsent = roll.filter(s => s.present === false).length;
    const unmarked = roll.filter(s => s.present === null).length;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 0, 93); 
    doc.text("ATTENDANCE REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Class Tier: ${currentclass.toUpperCase()} | Period: ${record.month} ${record.year} (${record.week})`, 14, 27);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    autoTable(doc, {
      startY: 38,
      head: [['Metric', 'Count']],
      body: [
        ['Total Children on Roster', totalChildren.toString()],
        ['Total Present', totalPresent.toString()],
        ['Total Absent', totalAbsent.toString()],
        ['Unmarked Rows', unmarked.toString()]
      ],
      theme: 'striped',
      headStyles: { fillColor: [103, 80, 164] },
      margin: { left: 14, right: 14 }
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(33, 0, 93);
    doc.text("General Roster Status Summary", 14, doc.lastAutoTable.finalY + 10);

    const generalBody = roll.map((s, idx) => [
      idx + 1,
      s.title,
      s.present === true ? 'Present' : s.present === false ? 'Absent' : 'Unmarked'
    ]);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 14,
      head: [['S/N', 'Full Name', 'Status']],
      body: generalBody,
      theme: 'grid',
      headStyles: { fillColor: [103, 80, 164] }, 
      columnStyles: { 0: { cellWidth: 15 }, 2: { cellWidth: 30 } }
    });

    const absentStudents = roll.filter(s => s.present === false);
    if (absentStudents.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(186, 26, 26); 
      doc.text("Isolated Absentee Roll Summary", 14, doc.lastAutoTable.finalY + 10);

      const absentBody = absentStudents.map((s, idx) => [idx + 1, s.title, 'Absent']);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 14,
        head: [['S/N', 'Full Name', 'Status']],
        body: absentBody,
        theme: 'grid',
        headStyles: { fillColor: [186, 26, 26] },
        columnStyles: { 0: { cellWidth: 15 }, 2: { cellWidth: 30 } }
      });
    }

    doc.save(`Attendance_${currentclass}_${record.year}_${record.month}_${record.week.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FDF8FF] text-[#1C1B1F]">
      <Navbar />
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Block */}
        <div className="w-full py-6 flex items-center gap-3 justify-between max-sm:justify-center border-b border-[#CAC4D0]/30 mb-6">
          <div className="flex gap-3 items-center">
            <div className="p-2.5 bg-[#EADDFF] text-[#21005D] rounded-xl m3-elevation-1">
              <Calendar size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1C1B1F] capitalize">Attendance Logs ({currentclass})</h1>
              <p className="text-xs font-medium text-[#49454F] mt-0.5">Browse past sheets and export detailed reporting sheets</p>
            </div>
          </div> 
        </div>

        {/* History Stream */}
        <div className="flex flex-col gap-3">
          {historyList.map((record) => {
            const classGroup = record.attroll?.find(c => c.theclass === currentclass) || { roll: [] };
            const roll = classGroup.roll || [];
            
            // Added calculations for metric display row
            const total = roll.length;
            const present = roll.filter(s => s.present === true).length;
            const absent = roll.filter(s => s.present === false).length;

            return (
              <div key={record._id || record.id} className="w-full bg-[#F7F2FA] p-5 rounded-2xl border border-[#CAC4D0]/20 m3-elevation-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:m3-elevation-2 transition duration-200">
                <div>
                  <h4 className="text-sm font-bold text-[#1C1B1F] capitalize flex items-center gap-2">
                    <Layers size={14} className="text-[#6750A4]" />
                    {record.month} {record.year} — <span className="text-[#6750A4]">{record.week}</span>
                  </h4>
                  
                  {/* Replaced 'Total Tracked Children' text block with dynamic segmented stat row */}
                  <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-[#49454F]">
                    <span>Total: <span className="font-bold text-[#1C1B1F]">{total}</span></span>
                    <span className="h-3 w-px bg-[#CAC4D0]"></span>
                    <span>Present: <span className="font-bold text-[#386A20]">{present}</span></span>
                    <span className="h-3 w-px bg-[#CAC4D0]"></span>
                    <span>Absent: <span className="font-bold text-[#BA1A1A]">{absent}</span></span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => generatePDF(record)}
                    className="m3-state-layer h-10 px-4 bg-[#6750A4] text-white rounded-full text-xs font-semibold flex items-center gap-2 m3-elevation-1 hover:m3-elevation-2 cursor-pointer transition duration-200"
                  >
                    <Download size={14} /> Download PDF 
                  </button>
                  <button 
                    onClick={() => deleteattendance(record._id || record.id)}
                    className="m3-state-layer h-10 w-10 bg-[#BA1A1A]/10 hover:bg-[#BA1A1A]/20 text-[#BA1A1A] rounded-full flex items-center justify-center cursor-pointer transition duration-200"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}

          {historyList.length === 0 && (
            <div className="w-full text-center py-16 bg-[#F7F2FA] border border-dashed border-[#CAC4D0] rounded-[32px] text-[#49454F] font-medium text-sm">
              No historical data logs match the active class selection profiles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistoryPage;
