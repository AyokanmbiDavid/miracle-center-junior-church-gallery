import { PersonStanding, RefreshCcw } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { all_provider } from './ContextProvider'

const Navbar = ({refreshfuc}) => {
    const {currentclass,setcurrentclass} = useContext(all_provider)
    const Navs = [
        {name:'4-5',set:'four'},
        {name:'6-8',set:'six'},
        {name:'9-12',set:'nine'},
    ]
    
  return (
    <>
        <div className="w-full flex p-3 items-center justify-center gap-5">
            <div className="bg-blue-100 border border-blue-200 flex justify-center items-center rounded-full p-0.5">
                {Navs.map((item,index) => (
                    <div
                    key={index}
                    onClick={async() => setcurrentclass(String(item.set))}
                    className={`p-5 flex justify-center  items-center ${index == 0 ? 'rounded-4xl rounded-r-2xl' : index == 2 ? 'rounded-4xl rounded-l-2xl' : 'rounded-2xl'} duration-300 cursor-pointer 
                     ${currentclass == item.set ? 'bg-blue-700 text-white shadow-2xl' : 'hover:bg-blue-200'}`}>
                        <span className="text-xs font-bold flex  gap-3 items-center">
                            <span className="max-sm:hidden">
                                <PersonStanding size={20} />
                            </span>
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* refresh component */}
            <button 
            onClick={() => refreshfuc()}
            className=" text-xs rounded-3xl flex items-center gap-3 font-bold bg-green-200 p-4 hover:bg-green-300 duration-300 cursor-pointer ">
               <span className="max-sm:hidden">
                 Refresh 
               </span>
                <RefreshCcw size={25}/>
            </button>
        </div>
    </>
  )
}

export default Navbar
