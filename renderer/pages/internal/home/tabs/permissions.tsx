import React from 'react'

function Permissions() {
  return (
    <div className='w-full flex flex-row'>
        <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
            <span className='font-semibold text-[20px]'>Permissions</span>
            <div className='bg-red-500 w-full flex flex-col'>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
                <div>Hello</div>
            </div>
        </div>
        <div className='w-full max-w-[450px] bg-secondary p-[20px] flex flex-col'>
            <span className='font-semibold text-[20px]'>Add Permission</span>
        </div>
    </div>
  )
}

export default Permissions;