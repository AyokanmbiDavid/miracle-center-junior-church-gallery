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

const App = () => {
  const [refreshfunc, setrefreshfunc] = useState()

  useEffect(() => {
    const theme = localStorage.getItem('theme')

    if (theme !== 'light') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

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
      <Navbar />

      {/* Main Container taking up remaining viewport height */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar refreshf={refreshfunc} />

        {/* Dynamic Scrollable Page Content View */}
        <main className="flex-1 overflow-y-auto overflow-hidden h-[calc(100vh-64px)] p-4 sm:p-6 border-l border-t border-gray-200 dark:border-gray-800 transition-all duration-200 rounded-tl-3xl bg-white dark:bg-gray-950">
          <Routes>
            <Route path="/" element={<General />} />
            <Route path="/dailystatus" element={<Status />} />
            <Route path="/throwback" element={<Throwback />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/classes/:id" element={<SubGeneral />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App