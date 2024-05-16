import React from 'react'
import { UnderdevelopmentProp } from '../../helpers/typings/props'

function Underdevelopment({ header, message }: UnderdevelopmentProp) {
  return (
    <div className='w-full flex flex-1 flex-col items-center justify-center'>
        <span className='text-[20px] font-semibold font-Inter'>{header}</span>
        <span className='text-[14px] font-Inter'>{message}</span>
    </div>
  )
}

export default Underdevelopment