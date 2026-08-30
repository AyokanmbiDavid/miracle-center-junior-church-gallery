import React from 'react'
import CardGrid from './Cards'

const Throwback = () => {
  return (
    <div>
      <div className="w-full p-2 flex max-sm:flex-col justify-between items-center dark:text-white">
        <h1 className="font-bold text-lg">
            Throwback Pictures
        </h1>

        <input type="search" placeholder='Type description here..'
        className='p-2 text-xs rounded-xl border-2 min-w-[250px] border-gray-200 font-semibold dark:bg-gray-700 dark:border-gray-600 duration-200 ' />
      </div>

      <CardGrid/>
    </div>
  )
}

export default Throwback
