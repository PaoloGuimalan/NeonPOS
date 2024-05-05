import React from 'react'
import { ConfirmordermodalProp } from '../../helpers/typings/props'

function Confirmordermodal({ children }: ConfirmordermodalProp) {
  return (
    <div className='z-[2] absolute bg-modal w-[calc(100%-80px)] h-full flex items-center justify-center'>
        {children}
    </div>
  )
}

export default Confirmordermodal