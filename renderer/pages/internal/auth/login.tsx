import React, { useEffect, useState } from 'react'
import { FcAssistant, FcUnlock } from 'react-icons/fc'
import NeonPOS from '../../../assets/NeonPOS.png'
import { LoginRequest } from '../../../helpers/https/requests';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTHENTICATION, SET_SETTINGS } from '../../../helpers/redux/types/types';
import { useRouter } from 'next/router';
import { dispatchnewalert } from '../../../helpers/reusables/alertdispatching';
import { MdClose, MdSettings } from 'react-icons/md';
import ReusableModal from '../../../components/modals/reusablemodal';
import { motion } from 'framer-motion';
import { settingsstate } from '../../../helpers/redux/types/states';
import { SettingsInterface } from '../../../helpers/typings/interfaces';

function Login() {

  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const [accountID, setaccountID] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  const [toggleSettingsModal, settoggleSettingsModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const settingsstorage = localStorage.getItem("settings");

    if(settingsstorage){
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: JSON.parse(settingsstorage)
        }
      });
    }
    else{
      router.push("/home");
    }
  }, []);

  const LoginProcess = () => {
    LoginRequest({
      accountID,
      password,
      userID: settings.userID
    }).then((response) => {
      if(response.data.status){
        if(response.data.result){
          const permissionsmapper = response.data.result[0].permissions.map((mp: any) => mp.permissionType);
          dispatch({
            type: SET_AUTHENTICATION,
            payload: {
              authentication: {
                auth: true,
                user: {
                  ...response.data.result[0],
                  permissions: permissionsmapper
                }
              }
            }
          })
          router.push("/internal/home/home");
          dispatchnewalert(dispatch, "success", "Successfully logged in");
          return;
        }
      }
      else{
        dispatchnewalert(dispatch, "warning", "Credentials are incorrect");
      }

      setaccountID("");
      setpassword("");
    }).catch((err) => {
      console.log(err);
      dispatchnewalert(dispatch, "error", "Error logging in");
    })
  }

  const ResetSetup = () => {
    localStorage.removeItem("settings");
    dispatch({
      type: SET_SETTINGS,
      payload: {
        settings: settingsstate
      }
    })
    settoggleSettingsModal(false);
  }
  
  return (
    <div className={`w-full h-full bg-primary absolute flex flex-1 flex-row font-Inter`}>
        <div className={`h-full bg-secondary flex flex-1`} />
        {toggleSettingsModal && (
          <ReusableModal shaded={true} padded={false} children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[400px] max-h-[110px] rounded-[7px] p-[20px] pb-[5px] flex flex-col'>
              <div className='w-full flex flex-row'>
                <div className='flex flex-1'>
                  <span className='text-[16px] font-semibold'>Reset Settings</span>
                </div>
                <div className='w-fit'>
                  <button onClick={() => { settoggleSettingsModal(false); }}><MdClose /></button>
                </div>
              </div>
              <div className='w-full flex flex-1 flex-col items-center justify-center gap-[3px]'>
                  <button onClick={ResetSetup} className='h-[30px] w-full bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Reset</span>
                  </button>
              </div>
            </motion.div>
          } />
        )}
        <div className='h-full bg-secondary flex flex-1 justify-center items-center max-w-[600px] p-[20px]'>
          <button onClick={() => { settoggleSettingsModal(!toggleSettingsModal) }} className='absolute bottom-[10px] left-[10px] p-[10px] rounded-[7px]'>
            <MdSettings className='text-accent-tertiary' style={{ fontSize: "25px" }} />
          </button>
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
                <input placeholder='Employee ID' value={accountID} onChange={(e) => { setaccountID(e.target.value) }} className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
              </div>
              <div className='border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row' >
                <div className='w-[45px] flex items-center justify-center'>
                  <FcUnlock style={{ fontSize: "22px" }} />
                </div>
                <input placeholder='Password' type='password' value={password} onChange={(e) => { setpassword(e.target.value); }} className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
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