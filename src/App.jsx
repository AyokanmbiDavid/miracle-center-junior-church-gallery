import React, { useContext, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import General from './user/pages/General/General'
import Status from './user/pages/Status/Status'
import Throwback from './user/pages/Throwback/Throwback'
import AdminPage from './admin/pages/AdminPage/AdminPage'
import SubGeneral from './user/pages/General/SubGeneral'
import MobileBottombar from './components/sidebar/MobileBottombar'
import { scale } from 'framer-motion'

const App = () => {
  const [refreshfunc, setrefreshfunc] = useState()
  const [showsidebar,setshowsidebar] = useState(false)

  const handleshowsidebar = () => {
    showsidebar ? setshowsidebar(false) : setshowsidebar(true)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Global Toast Notifications Container */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '12px',
          },
        }}
      />

      {/* Fixed top Navbar */}
      <Navbar setshowside={handleshowsidebar} />

      {/* Main Container taking up remaining viewport height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`max-md:hidden scale-x-0 w-0 origin-left transition-all duration-200 ${showsidebar && 'scale-x-100 w-50'}`}>
          <Sidebar refreshf={refreshfunc} />
        </div>

        {/* Dynamic Scrollable Page Content View */}
        <main className="flex-1 overflow-y-auto pb-20 overflow-hidden p-1 border-l border-t border-gray-200 dark:border-gray-800 transition-all duration-200  transition-all md:rounded-tl-3xl bg-white dark:bg-gray-950">
          <Routes>
            <Route path="/" element={<General />} />
            <Route path="/dailystatus" element={<Status />} />
            <Route path="/throwback" element={<Throwback />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/classes/:id" element={<SubGeneral />} />
          </Routes>
        </main>

       
      </div>
       <div className="md:hidden">
          <MobileBottombar />
        </div>
    </div>
  )
}

export default App