import React from 'react'
import ClassDropDown from './ClassDropdown'
import CardGrid from '../Cards'

const General = () => {
  return (
    <>
        <div className=" mb-20">
            <div className="w-full flex  justify-end item-start max-sm:flex-col gap-3 mt-2">
            {/* input selection */}
            <input type="search" 
            className="text-xs gap-2 border-2 bg-gray-100 border-gray-200 rounded-xl md:mr-10 p-2 w-[200px]" 
            placeholder='Name'/>

            <ClassDropDown/>
        </div>
    <CardGrid/>
        </div>
    </>
  )
}

export default General
