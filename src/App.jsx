import React, { useContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import General from './user/pages/General/General'
import Status from './user/pages/Status/Status'
import Throwback from './user/pages/Throwback/Throwback'
import AdminPage from './admin/pages/AdminPage/AdminPage'

const App = () => {
  const [refreshfunc,setrefreshfunc] = useState()
  useEffect(() => {
    const theme = localStorage.getItem('theme');

    if (theme  != 'light') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
  
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar refreshf={refreshfunc}/>
        {/* pages view */}
        <div className="w-full overflow-y-auto max-h-[600px] max-lg:max-h-[1500px] border-2 border-gray-200 dark:border-gray-800 transition-all duration-200 rounded-tl-3xl">
          <Routes>
            <Route path='/' element={<General/>} />
            <Route path='/dailystatus' element={<Status/>} />
            <Route path='/throwback' element={<Throwback/>}/>
            <Route path='/admin' element={<AdminPage/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
