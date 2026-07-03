import axios from 'axios';
import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const all_provider = createContext();

const URL1 = 'http://localhost:5000/api';
const first_url =  "https://teens-attendance-backend.onrender.com/api"
const api = axios.create({
  baseURL: first_url,
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
  const [allAttendanceHistory, setAllAttendanceHistory] = useState([]); // 👈 NEW: Holds everything for useEffect history list
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
      Notify("loading", 'sending request directory to server');
      const mRes = await api.get(`/member/${currentclass}`);
      setalldata(mRes.data); // Saves temporary data directly into React memory state
      Notify("success", "all children's data fetched");
    } catch (err) {
      console.error("Member sync failed.", err.message);
      Notify('failure', 'could not reach server');
    }
  }, [Notify, currentclass]);

  // Sync directory if class view changes
  useEffect(() => {
    fetchMembers();
  }, [currentclass, fetchMembers]);

  // 👈 NEW: Fetches absolute history ignoring any local filter requirements
  const fetchAllHistory = useCallback(async () => {
    Notify("loading","fetching all attendance from backend")
    try {
      const historyRes = await api.get('/children/allattendance');
       // Adjust endpoint path if different
      if (Array.isArray(historyRes.data)) {
        setAllAttendanceHistory(historyRes.data);
      } else {
        setAllAttendanceHistory([]);
      }
      Notify("success","Data successfully fetched")
    } catch (err) {
      console.error("Failed fetching compilation history logs", err);
      Notify("failure","failed to reach server")
    }
  }, []);

  // Core Refresh Action - Uses fresh targetDate parameter to avoid stale closures
  const fetchEverything = useCallback(async (targetDate) => {
    const queryDate = targetDate || attenddate; 
    try {
      Notify("loading", 'Fetching attendance request');
      const attres = await api.post('/children/attendance/filter', {
        year: queryDate.year, 
        month: queryDate.month, 
        week: queryDate.week
      });
      if (attres.data) {
        setattendance(attres.data);
      } else {
        setattendance(null);
      }
      
      // Auto-trigger full history update alongside filters so lists match
      await fetchAllHistory();
      Notify("success", "Good to go!!");
    } catch (err) {
      console.error("Full sync failed.", err);
      Notify('failure', 'Server not reachable');
    }
  }, [Notify, attenddate, fetchAllHistory]);

  // Fetch automatically whenever dates alter
  useEffect(() => {
    fetchEverything(attenddate);
  }, [attenddate, fetchEverything]);

const addnewmember = async (surname, firstname, middlename, dateofbirth, gender) => {
  Notify("loading", "Adding new child member");

  const exists = alldata.some(
    e => e.lastname === surname && 
         e.firstname === firstname && 
         e.middlename === middlename
  );

  if (!exists) {
    try {
      const payload = { 
        lastname: surname, 
        firstname: firstname, 
        middlename: middlename || "", 
        dateofbirth: dateofbirth, 
        gender: gender?.toLowerCase()
      };

      console.log("Sending Fused Member Payload:", payload);
      await api.post(`/member/${currentclass}`, payload);
      await fetchMembers(); 
      Notify("success", "New Child Member Added");
    } catch (err) { 
      Notify("failure", "Failed to add a child member");
      console.error("Add member network error details:", err.response?.data || err.message);
    } 
  } else {
    Notify('failure', 'Child data already registered');
  }
};

  const updatemember = async (id, data) => {
    Notify("loading", "Updating... from server");
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
      Notify("success", "Child's data updated on database");
    } catch (err) { Notify("failure", "Failed to send request"); console.error(err); }
  };

  const deletemember = async (id) => {
    Notify("loading", "Deleting...");
    try {
      await api.delete(`/member/${currentclass}/${id}`);
      await fetchMembers(); 
      Notify("success", "child's data Deleted");
    } catch (err) { Notify("failure", "failed to reach server"); console.error(err); }
  };

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

  const createattendance = async (year, month, week) => {
    Notify("loading", "Creating New Attendance for all classes");
    const arrayAttendance = Array.isArray(attendance) ? attendance : [];
    const exists = arrayAttendance.find(e => e.year === year && e.week === week && e.month === month);
    
    if (!exists) {
      try {
        await api.post('/children/attendance', { year, month, week });
        await fetchEverything({ year, month, week }); 
        Notify('success', "new attendance created for all classes");
      } catch (error) {
        Notify("failure", "failed to send request");
      } 
    } else {
      Notify('failure', 'User side Error!');
    }
  };

  const updateattendance = async (id, currentAttendanceState) => {
    Notify("loading", "updating attendance");
    try {  
      await api.put(`/children/attendance/${id}`, currentAttendanceState);
      await fetchEverything(); 
      Notify('success', "Attendance submitted to server");
    } catch (err) {
      Notify("failure", "Failed to submit attendance on server reach");
      console.error(err);
    }
  };

  const deleteattendance = async (id) => {
    Notify("loading", "Deleting... request..");
    try {
      await api.delete(`/children/attendance/${id}`);
      await fetchEverything(); 
      Notify("success", "Attendance deleted successfully");
    } catch (err) { Notify("failure", "Error could not reach server"); console.error(err); }
  };

  const contextValue = useMemo(() => ({
    alldata, currentroll, searchresult, currentclass, setcurrentclass,
    attenddate, setattenddate, attendance, setattendance,
    allAttendanceHistory, // 👈 NEW: Exporting your complete array state
    addnewmember, updatemember, deletemember, markattendance, createattendance, deleteattendance,
    updateattendance, Notify, notifystatus, closenotify, fetchMembers, fetchAllHistory,
    refresh: fetchEverything 
  }), [alldata, currentroll, searchresult, currentclass, attenddate, attendance, allAttendanceHistory, fetchEverything,fetchAllHistory, notifystatus, closenotify, Notify]);

  return (
    <all_provider.Provider value={contextValue}>
      {children}
    </all_provider.Provider>
  );
};

export default ContextProvider;
