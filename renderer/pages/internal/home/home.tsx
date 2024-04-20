import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { motion } from 'framer-motion';
import { AiOutlineLogout } from "react-icons/ai";
import { MdAccountCircle, MdDashboard, MdInventory, MdOutlineRestaurantMenu } from "react-icons/md";
import Routes from './routes';
import { routing } from '../../../utils/routesoptions';

function Home() {

  const router = useRouter();

  const [currenttab, setcurrenttab] = useState<string>("");

  const LogoutProcess = () => {
    router.push("/internal/auth/login");
  }

  return (
    <div className={`w-full h-full bg-primary absolute flex flex-1 flex-row`}>
        <div className='flex bg-accent-tertiary flex flex-1 flex-col max-w-[80px] items-center pt-[15px]'>
            <div className='bg-transparent w-full flex flex-1 flex-col items-center p-[7px] pr-[0px] gap-[7px]'>
              <motion.button
              whileHover={{
                background: "white",
                color: "#616161"
              }}
              onClick={() => {
                setcurrenttab(routing.DASHBOARD_ROUTE);
              }}
              className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                <MdDashboard style={{ fontSize: "30px" }} />
                <span className='text-[12px]'>Dashboard</span>
              </motion.button>
              <motion.button
              whileHover={{
                background: "white",
                color: "#616161"
              }}
              onClick={() => {
                setcurrenttab(routing.MENU_ROUTE);
              }}
              className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                <MdOutlineRestaurantMenu style={{ fontSize: "30px" }} />
                <span className='text-[12px]'>Menu</span>
              </motion.button>
              <motion.button
              whileHover={{
                background: "white",
                color: "#616161"
              }}
              onClick={() => {
                setcurrenttab(routing.INVENTORY_ROUTE);
              }}
              className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                <MdInventory style={{ fontSize: "30px" }} />
                <span className='text-[12px]'>Inventory</span>
              </motion.button>
              <motion.button
              whileHover={{
                background: "white",
                color: "#616161"
              }}
              onClick={() => {
                setcurrenttab(routing.ACCOUNT_ROUTE);
              }}
              className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                <MdAccountCircle style={{ fontSize: "30px" }} />
                <span className='text-[12px]'>Account</span>
              </motion.button>
            </div>
            <div className='bg-transparent w-full h-[100px] flex items-center justify-center p-[7px]'>
              <motion.button
              initial={{
                color: "red"
              }}
              whileHover={{
                background: "red",
                color: "white"
              }}
              onClick={LogoutProcess} className='text-red w-full h-[70px] rounded-[10px] flex items-center justify-center'>
                <AiOutlineLogout style={{ fontSize: "27px" }} />
              </motion.button>
            </div>
        </div>
        <div className='bg-transparent flex flex-1 justify-center'>
          <Routes tab={currenttab} />
        </div>
    </div>
  )
}

export default Home