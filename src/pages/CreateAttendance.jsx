import React, { useContext, useState } from 'react';
import { all_provider } from '../components/ContextProvider';
import Navbar from '../components/Navbar';
import { CalendarPlus, FilePlus, FilePlus2 } from 'lucide-react';

const CreateAttendancePage = () => {
  const { createattendance } = useContext(all_provider);
  const [formData, setFormData] = useState({ year: '2026', month: 'march', week: 'week 1' });

  const handleCreate = (e) => {
    e.preventDefault();
    createattendance(formData.year, formData.month, formData.week);
  };

  return (
    <div>
      <Navbar />
      <div className="w-full max-sm:px-2">
          {/* top */}
          <div className="w-full py-3 flex items-center gap-3 justify-between max-sm:justify-center">
            <div className="flex gap-3 items-center">
              <h1 className="text-xl text-blue-800 font-bold">Create Attendance</h1>
            <FilePlus2 size={20}/>
            </div> 
          </div>

          {/* form */}
          <form 
          onSubmit={handleCreate}
          className="w-full flex flex-col justify-center px-3">
            <div className="w-full bg-blue-50 p-2 rounded-3xl grid gap-3 grid-cols-3 max-sm:grid-cols-1">
                {/* group input */}
                {/* year */}
                <div className="w-full p-3 py-4 bg-blue-100 rounded-xl flex flex-col gap-3">
                  <label htmlFor="" className="text-xs font-bold">
                    Year
                  </label>
                  <select 
                  className='bg-white border-0 py-3 rounded-2xl'
                  onChange={(e)  => setFormData(prev => ({...prev, year:e.target.value}))}
                  >
                    {['2025','2026'].map(e => (
                      <option value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                 {/* month */}
                <div className="w-full p-3 py-4 bg-blue-100 rounded-xl flex flex-col gap-3">
                  <label htmlFor="" className="text-xs font-bold">
                    Month
                  </label>
                  <select 
                  className='bg-white border-0 py-3 rounded-2xl'
                  onChange={(e)  => setFormData(prev => ({...prev, year:e.target.value}))}
                  >
                    {['january','february','march','april','may','june','july','august','september','october','november','december'].map(e => (
                      <option value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                  {/* month */}
                <div className="w-full p-3 py-4 bg-blue-100 rounded-xl flex flex-col gap-3">
                  <label htmlFor="" className="text-xs font-bold">
                    Week
                  </label>
                  <select 
                  className='bg-white border-0 py-3 rounded-2xl'
                  onChange={(e)  => setFormData(prev => ({...prev, year:e.target.value}))}
                  >
                    {['week 1','week 2','week 3','week 4','week 5',].map(e => (
                      <option value={e}>{e}</option>
                    ))}
                  </select>
                </div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <button
              className="p-4 px-6 bg-blue-600 font-bold text-white rounded-xl text-xs hover:shadow-2xl hover:bg-blue-700 duration-200">
                Create Attendance
              </button>
            </div>
          </form>

      </div>
    </div>
  );
};

export default CreateAttendancePage;
