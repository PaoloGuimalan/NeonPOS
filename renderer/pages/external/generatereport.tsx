import React, { useEffect, useState } from 'react'
import { DailyReportInterface } from '../../helpers/typings/interfaces'

function GenerateReport() {

  const [dailyreport, setdailyreport] = useState<DailyReportInterface>({
    accountID: "",
    deviceID: "",
    dateMade: "",
    numberofsales: 0,
    totalsales: 0,
    discount: 0,
    discounttotal: 0,
    saleswdiscount: 0,
    taxtotal: 0,
    taxedsales: 0
  })

  useEffect(() => {
    // document.body.innerHTML = "<h1>HELLO WORLD</h1>"
    window.ipc.on('report-output', (event: string) => {
        setdailyreport(JSON.parse(event));

        setTimeout(() => {
            window.ipc.send("print-report", "");
        },1500);
    });
  },[]);

  return (
    <div className='w-full flex flex-col items-center p-[0px] pt-[20px] gap-[15px] font-mono'>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <span>Daily Report</span>
            <div className='w-full flex flex-row items-center gap-[10px]'>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
                <span>Restaurant</span>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='flex w-full'>
                <span>ACC ID: {dailyreport.accountID}</span>
            </div>
            <div className='flex w-full'>
                <span>DVC ID: {dailyreport.deviceID}</span>
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='flex w-full'>
                <span>DATE: {dailyreport.dateMade}</span>
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='w-full flex flex-row items-center gap-[10px]'>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
                <span>BASIC ANALYTICS</span>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='flex w-full'>
                <span>NUMBER OF ORDERS: {dailyreport.numberofsales}</span>
            </div>
            <div className='flex w-full'>
                <span>TOTAL SALES: &#8369;{dailyreport.totalsales}</span>
            </div>
            <div className='flex w-full'>
                <span>DISCOUNT ({dailyreport.discount}%): &#8369;{dailyreport.discounttotal}</span>
            </div>
            <div className='flex w-full'>
                <span>SALES WITH DISCOUNT: &#8369;{dailyreport.saleswdiscount}</span>
            </div>
            <div className='flex w-full'>
                <span>TAX TOTAL (12%): &#8369;{dailyreport.taxtotal}</span>
            </div>
            <div className='flex w-full'>
                <span>TAXED SALES: &#8369;{dailyreport.taxedsales}</span>
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='w-full flex flex-row items-center gap-[10px]'>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[2px] text-[12px]'>
            <div className='flex w-full justify-center'>
                <span className='flex flex-1 justify-center'>Report as of {dailyreport.dateMade} :))</span>
            </div>
        </div>
    </div>
  )
}

export default GenerateReport