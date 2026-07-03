import React, { useContext } from 'react'
import Navbar from './components/Navbar.jsx'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Notify from './components/Notify.jsx'
import { all_provider } from './components/ContextProvider.jsx'
import Sidebar from './components/Sidebar.jsx'
import BottomBar from './components/BottomBar.jsx'
import CreateAttendance from './pages/CreateAttendance.jsx'

// Importing your newly added pages
import AttendanceHistory from './pages/AttendanceHistory.jsx'
import AddMember from './pages/AddMember.jsx'
import MemberList from './pages/MemberList.jsx'

const App = () => {
  const { notifystatus } = useContext(all_provider)
  
  return (
    <>
      {notifystatus.show === true && <Notify />}
      
      <div className="flex max-md:flex-col w-full h-screen overflow-y-hidden bg-gray-50">
        {/* Navigation Sidebar for Large Screens */}
        <Sidebar />
        
        {/* Main Routed Content Viewport */}
        <div className="w-full pb-16 md:pb-0">
          <Routes>
            {/* Core Sheet Workspace Dashboard */}
            <Route path='/' element={<HomePage />} />
            
            {/* Roster & Attendance Creation Management Views */}
            <Route path='/createattendance' element={<CreateAttendance />} />
            <Route path='/allattendance' element={<AttendanceHistory />} />
            
            {/* Directory Profile Mutation Panels */}
            <Route path='/addmember' element={<AddMember />} />
            <Route path='/memberslist' element={<MemberList />} />
          </Routes>
        </div>
        
        {/* Bottom Navigation Ribbon Bar for Small Viewports */}
        <BottomBar />
      </div>
    </>
  )
}

export default App
