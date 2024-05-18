import React, { useState } from 'react'
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri'
import { OrdersItemProp } from '../../helpers/typings/props'
import { motion } from 'framer-motion';
import { CartItemInterface } from '../../helpers/typings/interfaces';

function OrdersItem({ mp }: OrdersItemProp) {

  const [expandOrder, setexpandOrder] = useState<boolean>(false);

  return (
    <div className='w-full bg-white p-[15px] border-[1px] min-h-[100px] flex flex-col gap-[10px]'>
        <div className='flex flex-row w-full'>
            <div className='flex flex-1 flex-col'>
                <button onClick={() => { setexpandOrder(!expandOrder) }} className='text-[16px] font-semibold flex flex-row items-center gap-[2px]'>
                    <span>{mp.orderID}</span>
                    {expandOrder ? (
                        <RiArrowDownSLine style={{ fontSize: "20px" }} />
                    ) : (
                        <RiArrowRightSLine style={{ fontSize: "20px" }} />
                    )}
                </button>
                <span className='text-[14px]'>Cashier: {mp.orderMadeBy.accountID}</span>
                <span className='text-[14px]'>Device ID: {mp.orderMadeBy.deviceID}</span>
                {(mp.voidedFrom && mp.voidedFrom.trim() !== "") && (
                    <span className='text-[14px]'>Voided From: {mp.voidedFrom}</span>
                )}
            </div>
            <div className='flex flex-1 flex-col items-center'>
                <div className='flex flex-row gap-[20px]'>
                    <div className='flex flex-col'>
                        <span className='text-[14px]'>Total: &#8369;{mp.totalAmount}</span>
                        <span className='text-[14px]'>Amount: &#8369;{mp.receivedAmount}</span>
                        <span className='text-[14px]'>Change: &#8369;{mp.receivedAmount - (mp.totalAmount - (mp.totalAmount * ((mp.discount ? parseInt(mp.discount) : 0) / 100)))}</span>
                        <span style={{ backgroundColor: mp.status? mp.status === "Voided" ? "red" : "#87CEEB" : "transparent", color: "white" }} 
                        className='text-[14px] w-fit p-[2px] px-[10px] mt-[5px] rounded-[4px] font-semibold'>{mp.status}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[14px]'>Items: {mp.orderSet.length}</span>
                        <span className='text-[14px]'>VAT (12%): &#8369;{(mp.totalAmount * 0.12).toFixed(2)}</span>
                        <span className='text-[14px]'>
                            Discount ({mp.discount ? mp.discount : 0}%): 
                            &#8369;{mp.discount ? (mp.totalAmount * (parseInt(mp.discount) / 100)) : 0}
                        </span>
                    </div>
                </div>
            </div>
            <div className='flex flex-1 flex-col items-end'>
                <span className='text-[14px] font-semibold'>{mp.dateMade}</span>
                <span className='text-[14px] font-semibold'>{mp.timeMade}</span>
            </div>
        </div>
        <motion.div
        initial={{
            height: "0px"
        }}
        animate={{
            height: expandOrder ? "auto" : "0px"
        }}
        className='w-full flex flex-col gap-[5px] overflow-y-hidden'>
            <span className='text-[14px] font-semibold'>Orders List</span>
            <div className='w-full flex flex-row flex-wrap gap-[5px] pb-[5px]'>
                {mp.orderSet.map((ordmp: CartItemInterface, i: number) => {
                    return(
                        <div key={i} className='min-w-[400px] flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none border-[1px]'>
                            <img src={ordmp.product.previews[0]} className='h-full max-w-[80px]' />
                            <div className='flex flex-1 flex-col'>
                                <div className='w-full flex flex-row'>
                                    <span className='text-[14px] font-semibold flex flex-1'>{ordmp.product.productName}</span>
                                    <span className='text-[12px]'>&#8369; {ordmp.product.productPrice} x {ordmp.quantity}</span>
                                </div>
                                <div className='w-full flex flex-row flex-1'>
                                    <span className='text-[12px] flex flex-1'>Total: &#8369; {ordmp.product.productPrice * ordmp.quantity}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    </div>
  )
}

export default OrdersItem