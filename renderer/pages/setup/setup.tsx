import React, { useEffect, useState } from 'react';
import ReusableModal from '../../components/modals/reusablemodal';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import NeonPOS from '../../assets/NeonPOS.png'
import NeonPOSSVG from '../../assets/NeonPOS_BG.svg'

function Setup() {

  const router = useRouter();

  const [easeIn, seteaseIn] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
        seteaseIn(true);
    },6000);
    setTimeout(() => {
        router.push("/setup/tabs/formtab");
    },8000);
  },[]);

  return (
    <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className='w-full h-full absolute flex items-center justify-center'>
        <ReusableModal shaded={false} padded={false} children={
            <motion.div
            initial={{
                maxHeight: "0px"
            }}
            animate={{
                maxHeight: easeIn ? "0px" : "600px"
            }}
            transition={{
                delay: easeIn ? 0 : 1,
                duration: easeIn ? 1 : 2,
                ease: "circInOut"
            }}
            className='w-[95%] h-[95%] max-w-[700px] rounded-[10px] overflow-y-hidden'>
                <div className='w-full h-full p-[20px] flex items-center justify-center'>
                    <img src={NeonPOS.src} className='h-[200px]' />
                </div>
            </motion.div>
        } />
    </div>
  )
}

export default Setup