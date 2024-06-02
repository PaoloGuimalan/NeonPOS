import React, { useEffect, useState } from 'react'
import Buttonloader from '../../../../components/loaders/buttonloader'
import { OrdersListInterface, SettingsInterface } from '../../../../helpers/typings/interfaces';
import { useSelector } from 'react-redux';
import { GetOrdersListRequest } from '../../../../helpers/https/requests';
import sign from 'jwt-encode';
import { JWT_SECRET } from '../../../../helpers/typings/keys';
import OrdersItem from '../../../../components/widgets/ordersitem';
import Pageloader from '../../../../components/holders/pageloader';
import { motion } from 'framer-motion';
import { dateGetter } from '../../../../helpers/reusables/generatefns';

function Orders() {

  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const [orderIDInput, setorderIDInput] = useState<string>("");
  const [orderlist, setorderlist] = useState<OrdersListInterface[]>([]);

  const [ordersFilter, setordersFilter] = useState<string>("Pending");

  const [isOrdersLoading, setisOrdersLoading] = useState<boolean>(false);

  const GetOrdersListProcess = (orderID: string) => {
    setisOrdersLoading(true);
    const encodeuserID = sign({ userID: settings.userID, orderID: orderID, datescope: dateGetter() }, JWT_SECRET);
    GetOrdersListRequest(encodeuserID).then((response) => {
      if(response.data.status){
        setorderlist(response.data.result);
      }
      // alert(JSON.stringify(response.data));
      setisOrdersLoading(false);
    }).catch((err) => {
      setisOrdersLoading(false);
      console.log(err);
    })
  }

  useEffect(() => {
    GetOrdersListProcess("");
  },[]);

  return (
    <div className='w-full h-full flex flex-row bg-shade font-Inter'>
      <div className='flex flex-1 flex-col p-[20px] gap-[10px]'>
        <span className='font-semibold text-[20px]'>Orders</span>
        <div className='w-full flex flex-row gap-[7px] mb-[20px]'>
          <input type='text' placeholder='Search an order using Order ID' value={orderIDInput} onChange={(e) => { setorderIDInput(e.target.value) }} className='w-full max-w-[400px] border-[1px] h-[35px] text-[14px] pl-[10px] pr-[10px]' />
          <button disabled={isOrdersLoading} onClick={() => { GetOrdersListProcess(orderIDInput) }} className='h-[35px] w-[120px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[0px] flex items-center justify-center'>
            {isOrdersLoading ? (
              <Buttonloader size='14px' />
            ) : (
              <span className='text-[14px]'>Search</span>
            )}
          </button>
          <button disabled={isOrdersLoading} onClick={() => { GetOrdersListProcess(""); setorderIDInput("") }} className='h-[35px] w-[120px] bg-header border-[1px] cursor-pointer shadow-sm text-black font-semibold rounded-[0px] flex items-center justify-center'>
            {isOrdersLoading ? (
              <Buttonloader size='14px' />
            ) : (
              <span className='text-[14px]'>{orderIDInput.trim() !== "" ? "Clear" : "Refresh"}</span>
            )}
          </button>
        </div>
        <div className='w-full flex flex-row gap-[4px]'>
          <motion.button 
          initial={{
            backgroundColor: "white",
            color: "black"
          }}
          animate={{
            backgroundColor: ordersFilter === "Pending" ? "#12051c" : "white",
            color: ordersFilter === "Pending" ? "white" : "black"
          }}
          onClick={() => { setordersFilter("Pending") }}
          className='shadow-lg border-[1px] min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>Pending</motion.button>
          <motion.button 
          initial={{
            backgroundColor: "white",
            color: "black"
          }}
          animate={{
            backgroundColor: ordersFilter === "Closed" ? "#12051c" : "white",
            color: ordersFilter === "Closed" ? "white" : "black"
          }}
          onClick={() => { setordersFilter("Closed") }}
          className='shadow-lg border-[1px] min-h-[40px] min-w-[130px] pl-[10px] pr-[10px] cursor-pointer shadow-sm rounded-[4px] flex flex-row items-center justify-center gap-[5px]'>Closed</motion.button>
        </div>
        <div className='w-full flex flex-col flex-1 pt-[0px] h-full overflow-y-scroll'>
          <div className='w-full bg-white flex flex-col flex-1 p-[15px] pt-[0px]'>
            <div className='w-full sticky top-0 pt-[15px] bg-white'>
              <div className='bg-header border-[1px] p-[15px] flex flex-row w-full h-fit'>
                <span className='text-[15px] flex flex-1 font-semibold'>Order ID</span>
                <span className='text-[15px] flex flex-1 font-semibold justify-center'>Order Details</span>
                <span className='text-[15px] flex flex-1 font-semibold justify-end'>Date Made</span>
              </div>
            </div>
            {orderlist.length > 0 ? (
              <div className='flex flex-col gap-[0px]'>
                {orderlist.filter((flt: OrdersListInterface) => {
                  if(ordersFilter === "Closed"){
                    return flt.status === "Renewed" || flt.status === "Initial" || flt.status === "Voided";
                  }
                  else{
                    return flt.status === ordersFilter;
                  }
                }).map((mp: OrdersListInterface, i: number) => {
                  return(
                    <OrdersItem key={i} mp={mp} GetOrdersListProcess={GetOrdersListProcess} />
                  )
                })}
              </div>
            ) : (
              <div className='w-full flex flex-1'>
                <Pageloader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders