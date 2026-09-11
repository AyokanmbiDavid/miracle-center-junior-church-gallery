import { Check, Loader, Loader2, X } from 'lucide-react'
import React from 'react'
import {motion} from 'framer-motion'

const Notification = ({state,show}) => {
  return (
    <>
        <motion.div
        initial={{opacity:0.8,x:20}}
        animate={{opacity:1,x:-10}}
        transition={{duration:1}}
        className="fixed z-70 bottom-5 right-5 ">
            <div className={`${state == 'success' ? 'bg-green-200 dark:bg-blue-800/70 dark:text-white' : 'bg-red-200' } p-3 rounded-xl
            font-bold flex items-center gap-3 text-sm`}>
                {state == 'success' ? 'Process is successful' : state == 'fail' ? 'Process failed' : 'Loading'}
                {state == 'success' ? <Check />: state == 'fail' ? <X/>:<></>}
            </div>
        </motion.div>
    </>
  )
}

export default Notification
