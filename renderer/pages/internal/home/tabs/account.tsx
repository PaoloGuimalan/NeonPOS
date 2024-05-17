import React from 'react'
import Underdevelopment from '../../../../components/holders/underdevelopment'
import { AuthenticationInterface } from '../../../../helpers/typings/interfaces'
import { useSelector } from 'react-redux'

function Account() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);

  return (
    <div className='w-full h-full flex flex-row bg-shade font-Inter'>
      <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
        <span className='font-semibold text-[20px]'>Account</span>
        {/* <Underdevelopment header='Account is still in progress' message='Will be available soon.' /> */}
        <div className='bg-transparent flex flex-row gap-[10px]'>
          <div className='flex flex-col w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px]'>
              <span className='text-[17px] font-semibold'>{authentication.user.accountID}</span>
              <div>
                <span className='text-[14px] font-semibold'>
                  {authentication.user.accountName.lastname + ", "} 
                  {authentication.user.accountName.firstname + ", "}
                  {authentication.user.accountName.middlename}
                </span>
              </div>
              <div>
                <span className='text-[14px] font-semibold'>Date Created: </span>
                <span className='text-[14px]'>{authentication.user.dateCreated}</span>
              </div>
          </div>
          <div className='flex flex-row w-full gap-[5px]'>
              <div className='bg-header shadow-md border-[1px] p-[15px] rounded-[4px] flex flex-col flex-1 gap-[7px]'>
                <div>
                  <span className='text-[16px] font-semibold'>Orders Stat</span>
                </div>
                <div className='flex items-center justify-center gap-[4px]'>
                  <span className='text-[16px]'>You made </span>
                  <span className='text-[16px] font-semibold'>--</span>
                  <span className='text-[16px]'> orders</span>
                </div>
              </div>
              <div className='bg-header shadow-md border-[1px] p-[15px] rounded-[4px] flex flex-1 flex-col'>
                <div className='pb-[4px]'>
                  <span className='text-[16px] font-semibold'>Details</span>
                </div>
                <div className='flex gap-[4px]'>
                  <span className='text-[14px] font-semibold'>Account Type: </span>
                  <span className='text-[14px]'>{authentication.user.accountType}</span>
                </div>
                <div className='flex gap-[4px]'>
                  <span className='text-[14px] font-semibold'>Number of Permissions: </span>
                  <span className='text-[14px]'>{authentication.user.permissions.length}</span>
                </div>
              </div>
          </div>
        </div>
        <div className='bg-transparent flex flex-row flex-1 gap-[10px]'>
          <div className='flex flex-col w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
            <span className='text-[12px] text-text-secondary'>Edit details section</span>
          </div>
          <div className='flex flex-col w-full gap-[5px]'>
            <div className='flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
              <span className='text-[12px] text-text-secondary'>Actions made list</span>
            </div>
            <div className='flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
              <span className='text-[12px] text-text-secondary'>Orders made this day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account