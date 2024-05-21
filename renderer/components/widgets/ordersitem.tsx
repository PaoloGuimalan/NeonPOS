import React, { useState } from 'react'
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri'
import { OrdersItemProp } from '../../helpers/typings/props'
import { motion } from 'framer-motion';
import { AuthenticationInterface, CartItemInterface, ReceiptHolderInterface, SettingsInterface } from '../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import ReusableModal from '../modals/reusablemodal';
import { MdClose } from 'react-icons/md';
import { CloseOrderRequest } from '../../helpers/https/requests';
import { dispatchnewalert } from '../../helpers/reusables/alertdispatching';
import Buttonloader from '../loaders/buttonloader';

function OrdersItem({ mp, GetOrdersListProcess }: OrdersItemProp) {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();

  const [expandOrder, setexpandOrder] = useState<boolean>(false);
  const [toCloseOrder, settoCloseOrder] = useState<boolean>(false);

  const [amountreceived, setamountreceived] = useState<number>(0);
  const [isClosingOrder, setisClosingOrder] = useState<boolean>(false);

  const RePrintProcess = () => {
    const printTemplateData: ReceiptHolderInterface = {
        cashier: authentication.user.accountName.firstname,
        orderID: mp.orderID,
        deviceID: settings.deviceID,
        date: mp.dateMade,
        time: mp.timeMade || "",
        cartlist: mp.orderSet,
        total: mp.totalAmount.toString(),
        amount: mp.receivedAmount.toString(),
        change: (mp.receivedAmount - mp.totalAmount).toString(),
        discount: mp.discount.toString(),
        isPending: false,
      }

      window.ipc.send("ready-print", JSON.stringify(printTemplateData));
  }

  const PrintCartList = () => {
    const printTemplateData: ReceiptHolderInterface = {
        cashier: authentication.user.accountName.firstname,
        orderID: mp.orderID,
        deviceID: settings.deviceID,
        date: mp.dateMade,
        time: mp.timeMade,
        cartlist: mp.orderSet,
        total: mp.totalAmount.toString(),
        amount: mp.receivedAmount.toString(),
        change: (mp.receivedAmount - mp.totalAmount).toString(),
        discount: mp.discount.toString(),
        isPending: true,
    }

    // alert(JSON.stringify(printTemplateData, null, 4))

    window.ipc.send("ready-print", JSON.stringify(printTemplateData));
  }

  const PrintSummary = () => {
    if(amountreceived >= mp.totalAmount){
        setisClosingOrder(true);
        CloseOrderRequest({
            orderID: mp.orderID,
            amountreceived: amountreceived,
            orderMadeBy: {
                accountID: authentication.user.accountID,
                userID: settings.userID,
                deviceID: settings.deviceID
            }
        }).then((response) => {
            if(response.data.status){
                GetOrdersListProcess("")
                // alert(JSON.stringify(response.data.result));
                dispatchnewalert(dispatch, "success", response.data.message);
                setamountreceived(0);
                settoCloseOrder(false);
                if(response.data.result.length > 0){
                    const printTemplateData: ReceiptHolderInterface = {
                        cashier: authentication.user.accountName.firstname,
                        orderID: response.data.result[0].orderID,
                        deviceID: settings.deviceID,
                        date: response.data.result[0].dateMade,
                        time: response.data.result[0].timeMade,
                        cartlist: response.data.result[0].orderSet,
                        total: response.data.result[0].totalAmount.toString(),
                        amount: response.data.result[0].receivedAmount.toString(),
                        change: (response.data.result[0].receivedAmount - response.data.result[0].totalAmount).toString(),
                        discount: response.data.result[0].discount.toString(),
                        isPending: false,
                    }

                    // alert(JSON.stringify(printTemplateData, null, 4))

                    window.ipc.send("ready-print", JSON.stringify(printTemplateData));
                }
            }
            else{
                dispatchnewalert(dispatch, "error", response.data.message);
            }
            setisClosingOrder(false);
        }).catch((err) => {
            console.log(err);
            setisClosingOrder(false);
            dispatchnewalert(dispatch, "error", "Error making request");
        })
    }
    else{
        dispatchnewalert(dispatch, "warning", "Insufficient amount!");
    }
  }

  return (
    <div className='w-full bg-white p-[15px] border-[1px] min-h-[100px] flex flex-col gap-[10px]'>
        {toCloseOrder && (
            <ReusableModal shaded={true} padded={true} children={
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[600px] max-h-[190px] p-[20px] rounded-[7px] flex flex-col gap-[10px]'>
                    <div className='w-full flex flex-row'>
                        <div className='flex flex-1'>
                            <span className='text-[16px] font-semibold'>Close Order</span>
                        </div>
                        <div className='w-fit'>
                            <button disabled={isClosingOrder} onClick={() => { settoCloseOrder(false); }}><MdClose /></button>
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-[5px]'>
                        <span className='text-[18px] font-Inter font-semibold'>{mp.orderID}</span>
                        <div className='flex flex-row gap-[10px] items-center'>
                            <span className='text-[16px]'>&#8369;</span>
                            <input type='number' value={amountreceived} onChange={(e) => { setamountreceived(parseInt(e.target.value)) }} min={0.00} step={0.001} placeholder='Input amount received' className='border-[1px] flex flex-1 p-[10px] pl-[5px] pr-[5px] text-[14px] outline-none' />
                        </div>
                        <div className='w-full flex pl-[20px]'>
                            <button disabled={isClosingOrder} onClick={PrintSummary} className='h-[35px] w-full bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                                {isClosingOrder ? (
                                    <Buttonloader size='14px' />
                                ) : (
                                    <span className='text-[14px]'>Confirm</span>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            } />
        )}
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
                        <span style={{ backgroundColor: mp.status? mp.status === "Pending" ? "orange" : mp.status === "Voided" ? "red" : "#87CEEB" : "transparent", color: "white" }} 
                        className='text-[14px] w-fit p-[2px] px-[10px] mt-[5px] rounded-[4px] font-semibold'>{mp.status}</span>
                    </div>
                    <div className='flex flex-col'>
                        <span className='text-[14px]'>Items: {mp.orderSet.length}</span>
                        <span className='text-[14px]'>VAT (12%): &#8369;{(mp.totalAmount * 0.12).toFixed(2)}</span>
                        <span className='text-[14px]'>
                            Discount ({mp.discount ? mp.discount : 0}%): 
                            &#8369;{mp.discount ? (mp.totalAmount * (parseInt(mp.discount) / 100)) : 0}
                        </span>
                        <span className='text-[14px]'>Table Number: {mp.tableNumber || "None"}</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-1 flex-col items-end'>
                <span className='text-[14px] font-semibold'>{mp.dateMade}</span>
                <span className='text-[14px] font-semibold'>{mp.timeMade}</span>
                {mp.status === "Pending" ? (
                    <div className='flex flex-1 flex-row justify-end items-end gap-[5px]'>
                        <button onClick={PrintCartList} className='h-[35px] w-[110px] rounded-[5px] bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[0px] flex items-center justify-center'>
                            <span className='text-[14px]'>Print Cart list</span>
                        </button>
                        <button onClick={() => { settoCloseOrder(true); }} className='h-[35px] w-[110px] rounded-[5px] bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[0px] flex items-center justify-center'>
                            <span className='text-[14px]'>Close Order</span>
                        </button>
                    </div>
                ): (
                    <div className='flex flex-1 flex-col justify-end'>
                        <button onClick={RePrintProcess} className='h-[35px] w-[70px] rounded-[5px] bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[0px] flex items-center justify-center'>
                            <span className='text-[14px]'>Reprint</span>
                        </button>
                    </div>
                )}
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
                        <div key={i} title={ordmp.product.productName} className='min-w-[400px] flex flex-row bg-white p-[10px] min-h-[90px] gap-[7px] shadow-md select-none border-[1px]'>
                            <img src={ordmp.product.previews[0]} className='h-full max-w-[80px]' />
                            <div className='flex flex-1 flex-col'>
                                <div className='w-full flex flex-row'>
                                    <span className='text-[14px] font-semibold flex flex-1 marquee'>{ordmp.product.productName}</span>
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