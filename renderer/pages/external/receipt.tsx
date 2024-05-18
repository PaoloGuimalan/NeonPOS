import React, { useEffect, useState } from 'react'
import { CartItemInterface, ReceiptHolderInterface } from '../../helpers/typings/interfaces';

function Receipt() {

  const [receiptholder, setreceiptholder] = useState<ReceiptHolderInterface>({
    cashier: "",
    orderID: "",
    deviceID: "",
    date: "",
    time: "",
    cartlist: [],
    total: "",
    amount: "",
    change: "",
    discount: "",
  });

  useEffect(() => {
    // document.body.innerHTML = "<h1>HELLO WORLD</h1>"
    window.ipc.on('receipt-output', (event: string) => {
        setreceiptholder(JSON.parse(event));

        setTimeout(() => {
            window.ipc.send("print-receipt", "");
        },1500);
    });
  },[]);

  return (
    <div className='w-full flex flex-col items-center p-[0px] pt-[20px] gap-[15px] font-mono'>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <span>Welcome</span>
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
                <span>CASHIER: {receiptholder.cashier}</span>
            </div>
            <div className='flex w-full'>
                <span>ORDER ID: {receiptholder.orderID}</span>
            </div>
            <div className='flex w-full'>
                <span>DVC ID: {receiptholder.deviceID}</span>
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='flex w-full'>
                <span>DATE: {receiptholder.date}</span>
            </div>
            <div className='flex w-full'>
                <span>TIME: {receiptholder.time}</span>
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='w-full flex flex-row items-center gap-[10px]'>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
                <span>YOUR ORDER</span>
                <hr style={{
                    borderTop: "dashed 1px"
                }} className='flex flex-1' />
            </div>
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            {receiptholder.cartlist.map((mp: CartItemInterface, i: number) => {
                return(
                    <div className='flex w-full'>
                        <span className='flex flex-1'>{mp.product.productName} ({mp.quantity}x)</span>
                        <span>&#8369;{mp.product.productPrice * mp.quantity}</span>
                    </div>
                )
            })}
        </div>
        <div className='w-full flex flex-col items-center gap-[0px] text-[12px]'>
            <div className='flex w-full'>
                <span>TOTAL: &#8369;{receiptholder.total}</span>
            </div>
            <div className='flex w-full'>
                <span>AMOUNT: &#8369;{receiptholder.amount}</span>
            </div>
            <div className='flex w-full'>
                <span>DISCOUNT ({receiptholder.discount}%): &#8369;{parseInt(receiptholder.total) * (parseInt(receiptholder.discount) / 100)}</span>
            </div>
            <div className='flex w-full'>
                <span>CHANGE: &#8369;{receiptholder.change}</span>
            </div>
            <div className='flex w-full'>
                <span>VAT AMOUNT (12%): &#8369;{parseInt(receiptholder.total) * 0.12}</span>
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
                <span className='flex flex-1 justify-center'>Thank you for dining :))</span>
            </div>
        </div>
    </div>
  )
}

export default Receipt