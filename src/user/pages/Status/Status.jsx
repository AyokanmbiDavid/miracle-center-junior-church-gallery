import React,{useContext, useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClassDropDown from './ClassDropdown'
import CardGrid from './Cards'
import { gallery } from '../../../components/ContextProvider'


const Status = () => {
  const [currentclass, setcurrentclass] = useState('All')
 

  return (
    <>
    <div className="relative p-3 overflow-y-auto">
        {/* top */}
        <div className="w-full flex max-sm:flex-col justify-between dark:text-white">
          <div className="">
            <h1 className="text-lg font-bold">
              Recent Service Photos
            </h1>
            <h1 className="mt-2 text-sm max-sm:mt-2 ">
              Sunday, September,2026
            </h1>
          </div>

          {/*  */}
            <ClassDropDown/>
        </div>

        <CardGrid />
    </div>
    </>
  )
}

export default Status
