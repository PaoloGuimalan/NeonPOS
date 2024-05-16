import React from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { motion } from 'framer-motion'
import { ButtonloaderProp } from '../../helpers/typings/props'

function Buttonloader({ size }: ButtonloaderProp) {
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
            <AiOutlineLoading3Quarters style={{ fontSize: size }} />
        </motion.div>
    </div>
  )
}

export default Buttonloader