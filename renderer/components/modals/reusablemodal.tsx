import React from 'react'
import { ReusableModalProp } from '../../helpers/typings/props'

function ReusableModal({ shaded, padded, children }: ReusableModalProp) {
  return (
    <div className={`z-[2] absolute ${shaded ? "bg-modal" : "bg-transparent"} ${padded ? "w-[calc(100%-80px)]" : "w-full"} h-full flex items-center justify-center`}>
        {children}
    </div>
  )
}

export default ReusableModal