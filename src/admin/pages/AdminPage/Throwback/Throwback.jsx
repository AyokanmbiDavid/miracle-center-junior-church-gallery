import React from 'react'
import CardGrid from '../Cards'

const Throwback = () => {
  return (
    <>
        <div className="w-full">
             {/* input selection */}
            <input type="search" 
            className="text-xs gap-2 border-2 bg-gray-100 border-gray-200 rounded-xl md:mr-10 p-2 w-[200px]" 
            placeholder='Name'/>

            <CardGrid/>
        </div>
    </>
  )
}

export default Throwback
