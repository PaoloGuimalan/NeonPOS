import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { motion } from 'framer-motion'

function Buttonloader() {
  return (
    <div className='w-full flex items-center justify-center'>
        <motion.div
        animate={{
            rotate: 360
        }}
        transition={{
            repeat: Infinity,
            duration: 1
        }}
        >
            <AiOutlineLoading3Quarters />
        </motion.div>
    </div>
  )
}

export default Buttonloader