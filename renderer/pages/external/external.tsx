import React, { useEffect, useState } from 'react'
import NeonPOS from '../../assets/NeonPOS.png'
import NeonPOSSVG from '../../assets/NeonPOS_BG.svg'
import { CartItemInterface, InvoiceInterface } from '../../helpers/typings/interfaces';

function External() {

  const [invoice, setinvoice] = useState<InvoiceInterface | null>(null);

  useEffect(() => {
    window.ipc.on('receive-invoice', (event: string) => {
      const parsedinvoice = JSON.parse(event);
      setinvoice(parsedinvoice);
    });
  },[]);

  return (
    <React.Fragment>
      <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className="mt-1 w-full absolute h-full flex-wrap flex flex-row justify-center items-center gap-[0px] pt-[0px] pr-[10px]">
        <div className='w-[calc(60%-10px)] h-[90%] bg-transparent flex items-center justify-center'>
          <img src={NeonPOS.src} className='h-[200px]' />
        </div>
        <div className='w-[40%] h-[90%] bg-modal flex flex-col p-[20px] text-white font-Inter gap-[10px] overflow-y-auto'>
          <div className='w-full'>
            <span className='text-[20px] font-semibold'>Your Order</span>
          </div>
          <div className='flex flex-col flex-1 gap-[10px]'>
            {invoice && (
              invoice.cartlist.map((mp: CartItemInterface, i:number) => {
                return(
                  <div key={i} className='w-full flex flex-row'>
                    <span className='flex flex-1'>{mp.product.productName} (x{mp.quantity})</span>
                    <span className='font-semibold'>&#8369; {mp.product.productPrice * mp.quantity}</span>
                  </div>
                )
              })
            )}
          </div>
          <div className='w-full flex flex-col'>
            <div className='text-[17px]'>Total: <span className='font-semibold'>&#8369; {invoice ? invoice.total : 0}</span></div>
            <div className='text-[17px]'>Amount Received: <span className='font-semibold'>&#8369; {invoice ? invoice.amountreceived : 0}</span></div>
            <div className='text-[17px]'>Discount ({invoice.discount}%): <span className='font-semibold'>&#8369; {invoice.total * (invoice.discount / 100)}</span></div>
            <div className='text-[17px]'>Change: <span className='font-semibold'>&#8369; {invoice ? invoice.change : 0}</span></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default External