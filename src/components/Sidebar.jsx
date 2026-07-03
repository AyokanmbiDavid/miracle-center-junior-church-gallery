import { Bird, Files, LayoutDashboard, PlusCircle, UserPlus, Users } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
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
        <div className="max-md:hidden min-w-[200px] hover:min-w-[250px] duration-500 h-screen flex justify-center items-center p-3">
            <div className="w-full border border-blue-100 bg-blue-50 h-full rounded-3xl flex flex-col p-2">
                {/* top with logo */}
                <div className="w-full py-3 flex items-start  gap-2 font-bold text-sm">
                    <span className="p-3 rounded-xl bg-blue-700 text-white">
                        <Bird />
                    </span>
                    Miracle Center Children 
                </div>

                {/* navs */}
                <div className="w-full mt-3 flex flex-col gap-2">
                    {Sides.map((item,index) => (
                        <>
                            <Link 
                            to={item.link}
                            key={index}
                            className={`w-full p-3 cursor-pointer duration-200 flex justify-between items-center ${index == 0 ? 'rounded-lg rounded-t-3xl' : index == 4 ? 'rounded-lg rounded-b-3xl' : 'rounded-lg'}
                                ${location == item.link ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white' : 'bg-blue-100 hover:bg-blue-200'}`}>
                                <span className="font-bold text-xs">
                                    {item.name}
                                </span>

                                <span className="">
                                    {item.icon}
                                </span>
                            </Link>
                        </>
                    ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default Sidebar
