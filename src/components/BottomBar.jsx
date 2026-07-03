import {Bird, Files, LayoutDashboard, PlusCircle, UserPlus, Users  } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BottomBar = () => {
     const location = useLocation().pathname
    const Sides = [
        {name:'Dashboard',link:'/',icon: <LayoutDashboard size={20}/>},
        {name:'Create Attendance',link:'/createattendance',icon: <PlusCircle size={20}/>},
        {name:'All Attendance',link:'/allattendance',icon: <Files size={20}/>},
        {name:'Add Member',link:'/addmember',icon: <UserPlus size={20}/>},
        {name:'Members List',link:'/memberslist',icon: <Users size={20}/>}
    ]
  return (
    <>
        <div className="w-full fixed bottom-0 md:hidden  p-2 z-20 items-center justify-between">
            <div className="w-full p-1 rounded-3xl bg-blue-100 flex justify-between items-center">
                {Sides.map((item,index) => (
                    <>
                        <Link
                        key={index}
                        to={item.link}
                        className={`p-3 py-5 w-full flex justify-center items-center rounded-4xl
                            ${location == item.link ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : 'bg-blue-100 hover:bg-blue-200'}`}
                        >
                            <span className="">
                                {item.icon}
                            </span>
                        </Link>
                    </>
                ))}
            </div>
        </div>
    </>
  )
}

export default BottomBar
