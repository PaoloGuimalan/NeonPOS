import React from 'react'
import Underdevelopment from '../../../../components/holders/underdevelopment'

function Account() {
  return (
    <div className='w-full h-full flex flex-row bg-shade font-Inter'>
      <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
        <span className='font-semibold text-[20px]'>Account</span>
        <Underdevelopment header='Account is still in progress' message='Will be available soon.' />
      </div>
    </div>
  )
}

export default Account