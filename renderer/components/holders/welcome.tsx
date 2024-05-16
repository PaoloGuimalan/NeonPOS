import React from 'react'
import { motion } from 'framer-motion'

function Welcome() {
  return (
    <div className='w-full bg-shade flex flex-1 flex-col items-center justify-center gap-[20px]'>
        <motion.div
        initial={{
            height: "0px"
        }}
        animate={{
            height: "100%"
        }}
        transition={{
            delay: 1,
            duration: 2,
            ease: "circInOut"
        }}
        className='overflow-y-hidden flex flex-col items-center justify-center gap-[20px]'
        >
            <span className='text-[25px] font-semibold font-Inter'>Welcome to Neon POS</span>
            <span className='text-[14px] font-Inter w-full max-w-[700px]'>We're thrilled to introduce you to Neon POS, an innovative Point-of-Sales system driven by the advanced Neon Service software. Our state-of-the-art solutions ensure seamless transactions and instant insights, transforming the way you do business.</span>
            <span className='text-[14px] font-Inter w-full max-w-[700px]'>Prepare for a new era of efficiency and control in your operations. Let's get started!</span>
        </motion.div>
    </div>
  )
}

export default Welcome