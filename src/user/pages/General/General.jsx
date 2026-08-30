import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import church from '../../../images/church.png'
import toddlers from '../../../images/toddlers.png'
import teenagers from '../../../images/teenagers.png'
import Children from '../../../images/Children.jpg'
import { ChevronRight } from 'lucide-react'

const General = () => {
  const [currentclass, setcurrentclass] = useState('All')

  const classes = [
    {id:1, label:'Toddlers',Ages:'0-5 yrs',img:toddlers,color:'blue',},
    {id:2, label:'Children',Ages:'6-8 yrs',img:toddlers,color:'yellow',},
    {id:3,label:'Pre-teens',Ages:'9-12 yrs',img:Children,color:'green',},
    {id:3, label:'Toddlers',Ages:'13-19 yrs',img:teenagers,color:'purple',},
  ]

  return (
    <>
    <div className="relative p-3 overflow-y-auto min-h-[700px]">
        {/* intro page welcom */}
        <div className="w-full relative h-[200px] w-full flex rounded-2xl">
          <div className=" flex z-50 pl-3 flex-col w-[30%] max-sm:w-[50%] justify-center dark:text-white gap-3 p-2 ">
            <span className="font-bold text-sm">Welcome to</span>
            <span className="text-lg" style={{fontWeight: 'bold'}}>
              Junior Church
            </span>
            <span className="text-xs mt-3">
              Nuturing young heart in faith and truth
            </span>
          </div>

          <div className="absolute left-0 top-0 w-[70%] h-full bg-gradient-to-l from-[#e9d5ac] dark:from-[#ffffff]  z-20">

          </div>

          {/* right */}
          <div className="w-[70%] z-30 max-sm:w-[50%]">
            <img src={church} className='h-[200px] w-[100%] rounded-r-2xl  object-cover' />
          </div>
        </div>

        {/* classes selector */}
        <div className="">
          <div className="w-full text-md font-bold mt-3 dark:text-white">
            Our classes
          </div>

            {/* grid layout */}
          <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-2">
            {classes.map((item,index) => (
              <>
                <div className={`w-full rounded-2xl border-2 flex p-2 relative border-gray-100 dark:border-gray-800 `}>
                      {/*text  */}
                      <div className="flex w-[40%] flex-col justify-center ">
                        <span className={`text-md font-bold dark:text-white`}>
                          {item.label}
                        </span>
                        <span className={`text-xs dark:text-gray-200 `}>
                          Ages {item.Ages}
                        </span>
                      </div>

                      {/* image */}
                      <div className="w-[60%]">
                        <img src={item.img} className='h-35 w-full object-cover rounded-lg' />
                      </div>

                      <div className={`absolute bottom-2 right-5 rounded-full border-2 border-blue-500 bg-blue-300/80 text-blue-800 cursor-pointer`}>
                        <div className="rounded-full flex p-3 px-4 justify-center items-center">
                          <ChevronRight size={20}/>
                        </div>
                      </div>
                </div>
              </>
            ))}
          </div>
        </div>
    </div>
    </>
  )
}

export default General