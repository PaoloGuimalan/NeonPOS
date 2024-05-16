import React from 'react'
import { AuthenticationInterface, SettingsInterface } from '../../../../helpers/typings/interfaces'
import { useSelector } from 'react-redux'

function Dashboard() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  return (
    <div className='w-full h-full flex flex-row bg-shade font-Inter'>
      <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
        <span className='font-semibold text-[20px]'>Dashboard</span>
        <div className='bg-transparent flex flex-col flex-1 gap-[10px]'>
          <div className='w-full flex flex-row gap-[10px]'>
            <div className='flex flex-col w-full max-w-[400px] bg-header shadow-md border-[1px] p-[15px] rounded-[4px]'>
              <span className='text-[17px] font-semibold'>{settings.userID}</span>
              <div>
                <span className='text-[14px] font-semibold'>Total Sales: </span>
                <span className='text-[14px]'>&#8369; --</span>
              </div>
              <div>
                <span className='text-[14px] font-semibold'>Orders Made: </span>
                <span className='text-[14px]'>--</span>
              </div>
            </div>
            <div className='flex flex-col flex-1 gap-[4px]'>
              <div className='flex flex-1 gap-[4px]'>
                <div className='flex flex-row w-full max-w-[200px] bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]'>
                  <span className='text-[14px] font-semibold'>Number of Users: </span>
                  <span className='text-[14px]'>--</span>
                </div>
                <div className='flex flex-row flex-wrap flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px] justify-between'>
                  <div className='flex flex-row gap-[4px]'>
                    <span className='text-[14px] font-semibold'>Avg. orders per month: </span>
                    <span className='text-[14px]'>--</span>
                  </div>
                  <div className='flex flex-row gap-[4px]'>
                    <span className='text-[14px] font-semibold'>Avg. inventory cost per month: </span>
                    <span className='text-[14px]'>&#8369;--</span>
                  </div>
                  <div className='flex flex-row gap-[4px]'>
                    <span className='text-[14px] font-semibold'>Total current inventory cost: </span>
                    <span className='text-[14px]'>&#8369;--</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-1 gap-[4px]'>
                <div className='flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]'>
                  <span className='text-[14px] font-semibold'>Sales this month: </span>
                  <span className='text-[14px]'>&#8369;--</span>
                </div>
                <div className='flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]'>
                  <span className='text-[14px] font-semibold'>VAT Total this month: </span>
                  <span className='text-[14px]'>&#8369;--</span>
                </div>
                <div className='flex flex-row flex-1 bg-header shadow-md border-[1px] p-[15px] rounded-[4px] gap-[4px]'>
                  <span className='text-[14px] font-semibold'>Gross Margin: </span>
                  <span className='text-[14px]'>--%</span>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full flex flex-row flex-1 gap-[4px]'>
            <div className='flex flex-1 flex-col gap-[4px]'>
              <div className='flex flex-col flex-1 items-center justify-center w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px]'>
                <span className='text-[12px] text-text-secondary'>Graph of sales report this month | week | year</span>
              </div>
              <div className='flex flex-row flex-1 w-full gap-[4px]'>
                <div className='flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
                  <span className='text-[12px] text-text-secondary'>Graph of orders per day | month | year</span>
                </div>
                <div className='flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
                  <span className='text-[12px] text-text-secondary'>Graph of inventory expenses per month | year</span>
                </div>
              </div>
            </div>
            <div className='w-full max-w-[300px] flex flex-1'>
              <div className='flex flex-col flex-1 w-full bg-header shadow-md border-[1px] p-[15px] rounded-[4px] items-center justify-center'>
                <span className='text-[12px] text-text-secondary'>List of orders made this day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard