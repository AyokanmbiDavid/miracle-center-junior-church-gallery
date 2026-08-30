import React from 'react'
import {motion} from 'framer-motion'
import { XIcon } from 'lucide-react'

const ViewImage = ({src,show}) => {
  return (
    <>
        <div className="w-full h-full max-md:h-[1000px] z-30 flex justify-center items-start absolute top-0 left-0 bg-gray-100 dark:bg-gray-800 rounded-2xl ">
        <motion.div
        initial={{opacity:0.3,scale:0.8}}
        animate={{opacity:1,scale:1}}
        transition={{ease:"easeIn"}}
        className='flex justify-between items-center'>

        <div className="absolute top-3 right-5">
            <button 
            onClick={() => show({show:false,src:''})}
            className=" p-2 rounded-full border border-gray-300 cursor-pointer">
                <XIcon size={20}  />
            </button>    
        </div>          

          <img src={src} alt="gallery" 
          className='object-contain w-[100%] h-[400px]'/>

        </motion.div>
        </div>
    </>
  )
}

export default ViewImage
