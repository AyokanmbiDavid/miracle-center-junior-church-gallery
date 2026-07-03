import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const all_provider = createContext();

const URL1 = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: URL1,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const ContextProvider = ({ children }) => { 
  const [currentclass, setcurrentclass] = useState('four');
  const [searchresult, setsearchresult] = useState([]);
  const [attendance, setattendance] = useState(null);
  const [currentroll, setcurrentroll] = useState({ roll: [] });
  const [notifystatus, setnotifystatus] = useState({ type: "loading", message: "", show: true });

  // Initialize date safely from localStorage
  const [attenddate, setattenddate] = useState(() => {
    const saved = localStorage.getItem("attendancedate");
    return saved ? JSON.parse(saved) : { year: "2026", month: "march", week: "week 1" };
  });

  // Sync state changes back to localStorage
  useEffect(() => {
    localStorage.setItem('attendancedate', JSON.stringify(attenddate));
  }, [attenddate]);

  // Replaced useIndexedDB with a standard, temporary React state array
  const [alldata, setalldata] = useState([]);

  // Notifications
  const Notify = useCallback((type, message) => {
    setnotifystatus({ type, message, show: true });
    if (type !== "loading") {
      setTimeout(() => setnotifystatus({ type: "", message: "", show: false }), 3000);
    }
  }, []);

  const closenotify = useCallback(() => setnotifystatus({ type: "", message: "", show: false }), []);

  // Fetch Directory Children Members using the class dynamic endpoint wrapper
  const fetchMembers = useCallback(async () => {
    try {
      Notify("loading", 'updating member directory');
      const mRes = await api.get(`/member/${currentclass}`);
      setalldata(mRes.data); // Saves temporary data directly into React memory state
      Notify("success", "members updated");
    } catch (err) {
      console.error("Member sync failed.", err.message);
      Notify('failure', 'could not update members');
    }
  }, [Notify, currentclass]);

  // Sync directory if class view changes
  useEffect(() => {
    fetchMembers();
  }, [currentclass, fetchMembers]);

  // Core Refresh Action - Uses fresh targetDate parameter to avoid stale closures
  const fetchEverything = useCallback(async (targetDate) => {
    const queryDate = targetDate || attenddate; 
    try {
      Notify("loading", 'syncing all data...');
      const attres = await api.post('/children/attendance/filter', {
        year: queryDate.year, 
        month: queryDate.month, 
        week: queryDate.week
      });
      
      if (attres.data && attres.data) {
        setattendance(attres.data);
      } else {
        setattendance(null);
      }
      Notify("success", "Connected");
    } catch (err) {
      console.error("Full sync failed.", err);
      Notify('failure', 'network sync failed');
    }
  }, [Notify, attenddate]);

  // Fetch automatically whenever dates alter
  useEffect(() => {
    fetchEverything(attenddate);
  }, [attenddate, fetchEverything]);

const addnewmember = async (surname, firstname, middlename, dateofbirth, gender) => {
  Notify("loading", "Adding new member");

  // 1. Fixed: Standardized to use lowercase parameters 'firstname' and 'middlename'
  const exists = alldata.some(
    e => e.lastname === surname && 
         e.firstname === firstname && 
         e.middlename === middlename
  );

  if (!exists) {
    try {
      // 2. Fixed: Mapped lowercase parameters into your backend payload keys
      const payload = { 
        lastname: surname, 
        firstname: firstname, 
        middlename: middlename || "", 
        dateofbirth: dateofbirth, 
        gender: gender?.toLowerCase()
      };

      // Debug log to confirm exact data fields before network transmission
      console.log("Sending Fused Member Payload:", payload);

      // 3. Make the API call to your fused dynamic route parameter wrapper
      await api.post(`/member/${currentclass}`, payload);
      
      await fetchMembers(); 
      Notify("success", "New Member Added");
    } catch (err) { 
      Notify("failure", "Failed to add member");
      console.error("Add member network error details:", err.response?.data || err.message);
    } 
  } else {
    Notify('failure', 'Member data already registered');
  }
};



  const updatemember = async (id, data) => {
    Notify("loading", "Updating...");
    try {
      await api.put(`/member/${currentclass}/${id}`, {
        lastname: data.surname,
        firstname: data.firstName,
        middlename: data.middleName,
        dob: data.dateOfBirth,
        gender: data.gender?.toLowerCase(),
        active: data.active
      });
      await fetchMembers(); 
      Notify("success", "member data updated");
    } catch (err) { Notify("failure", "Failed"); console.error(err); }
  };

  const deletemember = async (id) => {
    Notify("loading", "Deleting...");
    try {
      await api.delete(`/member/${currentclass}/${id}`);
      await fetchMembers(); 
      Notify("success", "Member Deleted");
    } catch (err) { Notify("failure", "Failed to delete member"); console.error(err); }
  };

  // Safe Immutable Attendance State Updates aligned to your database document structure
  const markattendance = (id, status) => {
    if (!attendance || !attendance.attroll) return;

    setattendance(prev => ({
      ...prev,
      attroll: prev.attroll.map(classGroup => 
        classGroup.theclass !== currentclass 
          ? classGroup 
          : {
              ...classGroup,
              roll: classGroup.roll.map(student => 
                student.id !== id 
                  ? student 
                  : { ...student, present: status }
              )
            }
      )
    }));
  };

  // Attendance Action Mutations
  const createattendance = async (year, month, week) => {
    Notify("loading", "Creating New Attendance");
    const arrayAttendance = Array.isArray(attendance) ? attendance : [];
    const exists = arrayAttendance.find(e => e.year === year && e.week === week && e.month === month);
    
    if (!exists) {
      try {
        await api.post('/children/attendance', { year, month, week });
        await fetchEverything({ year, month, week }); 
        Notify('success', "new attendance created");
      } catch (error) {
        Notify("failure", "failed to create attendance");
      } 
    } else {
      Notify('failure', 'Attendance had been created');
    }
  };

  const updateattendance = async (id, currentAttendanceState) => {
    Notify("loading", "updating attendance");
    try {  
      await api.put(`/children/attendance/${id}`, { attroll: currentAttendanceState.attroll });
      await fetchEverything(); 
      Notify('success', "Attendance submitted");
    } catch (err) {
      Notify("failure", "Failed to submit attendance");
      console.error(err);
    }
  };

  const deleteattendance = async (id) => {
    Notify("loading", "Deleting...");
    try {
      await api.delete(`/children/attendance/${id}`);
      await fetchEverything(); 
      Notify("success", "Attendance deleted successfully");
    } catch (err) { Notify("failure", "Error"); console.error(err); }
  };

  const contextValue = useMemo(() => ({
    alldata, currentroll, searchresult, currentclass, setcurrentclass,
    attenddate, setattenddate, attendance, setattendance,
    addnewmember, updatemember, deletemember, markattendance, createattendance, deleteattendance,
    updateattendance, Notify, notifystatus, closenotify, 
    refresh: fetchEverything 
  }), [alldata, currentroll, searchresult, currentclass, attenddate, attendance, fetchEverything, notifystatus, closenotify, Notify]);

  return (
    <all_provider.Provider value={contextValue}>
      {children}
    </all_provider.Provider>
  );
};

export default ContextProvider;
