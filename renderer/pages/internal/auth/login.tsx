import React from 'react'
import { FcAssistant, FcUnlock } from 'react-icons/fc'
import NeonPOS from '../../../assets/NeonPOS.png'
import { useRouter } from 'next/router'

function Login() {

  const router = useRouter();

  const LoginProcess = () => {
    router.push("/internal/home/home");
  }
  
  return (
    <div className={`w-full h-full bg-primary absolute flex flex-1 flex-row`}>
        <div className={`h-full bg-secondary flex flex-1`} />
        <div className='h-full bg-secondary flex flex-1 justify-center items-center max-w-[600px] p-[20px]'>
          <div className='bg-primary w-full max-w-[500px] h-full max-h-[700px] flex flex-col gap-[15px] justify-center items-center rounded-[10px] shadow-md p-[10px]'>
            <div className='w-full max-w-[370px] flex flex-col gap-[50px] items-center justify-start pb-[10px]'>
                <img src={NeonPOS.src} className='h-[100px]' />
                <span className='text-[20px] font-semibold text-accent-secondary'>Login</span>
            </div>
            <div className='w-full max-w-[370px] flex flex-col gap-[15px]'>
              <div className='border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row' >
                <div className='w-[45px] flex items-center justify-center'>
                  <FcAssistant style={{ fontSize: "22px" }} />
                </div>
                <input placeholder='Employee ID' className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
              </div>
              <div className='border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row' >
                <div className='w-[45px] flex items-center justify-center'>
                  <FcUnlock style={{ fontSize: "22px" }} />
                </div>
                <input placeholder='Password' className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
              </div>
            </div>
            <div className='w-full max-w-[370px] pt-[10px] flex flex-col items-center gap-[15px]'>
                <button onClick={LoginProcess} className='bg-accent-secondary hover:bg-accent-hover cursor-pointer w-full max-w-[200px] shadow-sm h-[40px] text-white font-semibold rounded-[7px]'>Login</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login