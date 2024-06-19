import React, { useEffect, useRef, useState } from 'react'
import ReusableModal from '../../../components/modals/reusablemodal'
import { motion } from 'framer-motion'
import NeonPOS from '../../../assets/NeonPOS.png'
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg'
import { AlertsItem } from '../../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../../../components/widgets/alert';
import { dispatchclearalerts, dispatchnewalert } from '../../../helpers/reusables/alertdispatching';
import { InitialSetupDeviceVerificationRequest } from '../../../helpers/https/requests';
import { useRouter } from 'next/router';
import { MdClose, MdSettings } from 'react-icons/md';
import { CiFileOn } from "react-icons/ci";

function Formtab() {

  const [NSUSRID, setNSUSRID] = useState<string>("");
  const [NSDVCID, setNSDVCID] = useState<string>("");
  const [connectionToken, setconnectionToken] = useState<string>("");
  const [SetupType, setSetupType] = useState<string>("POS");

  const [isVerifying, setisVerifying] = useState<boolean>(false);

  const [isShuttingdown, setisShuttingdown] = useState<boolean>(false);
  const [toggleSettingsModal, settoggleSettingsModal] = useState<boolean>(false);
  
  const [formSwitch, setformSwitch] = useState<boolean>(false);

  const importFileRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const VerifyCredentials = () => {
    if(NSUSRID.trim() !== "" && NSDVCID.trim() !== "" && connectionToken.trim() !== ""){
        setisVerifying(true);
        InitialSetupDeviceVerificationRequest({
            userID: NSUSRID,
            deviceID: NSDVCID,
            connectionToken: connectionToken
        }).then((response) => {
            if(response.data.status){
                dispatchnewalert(dispatch, "success", response.data.message);
                localStorage.setItem("settings", JSON.stringify({
                    userID: NSUSRID,
                    deviceID: NSDVCID,
                    connectionToken: connectionToken,
                    setup: SetupType
                }));
                window.ipc.send("setup-type-reload", SetupType);
                dispatchclearalerts(dispatch);
                router.push("/home");
            }
            else{
                setisVerifying(false);
                dispatchnewalert(dispatch, "warning", response.data.message);
            }
        }).catch((err) => {
            console.log(err);
            setisVerifying(false);
            dispatchnewalert(dispatch, "error", "Error requesting verification");
        })
    }
    else{
        dispatchnewalert(dispatch, "warning", "Fields are incomplete");
    }
  }

  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const scrollDivAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollDivAlerts.current){
      const scrollHeight = scrollDivAlerts.current.scrollHeight;
      const clientHeight = scrollDivAlerts.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  },[alerts, scrollDivAlerts]);

  const CancelSetup = () => {
    setisShuttingdown(true);
    setTimeout(() => {
        window.ipc.send('execute-command', 'systemctl poweroff');
    }, 5000);
  }

  const OpenNeonRemote = () => {
    // window.ipc.send('execute-command', 'gnome-terminal');
    // settoggleSettingsModal(false);
    window.ipc.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    settoggleSettingsModal(false);
  }

  const OpenTerminal = () => {
    window.ipc.send('execute-command', 'gnome-terminal');
    settoggleSettingsModal(false);
  }

//   const CancelSetup = () => {
//     dispatchnewalert(dispatch, "warning", "Cannot cancel setup");
//   }

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
      if(typeof event.target.result === "string"){
        const splittedvalue = event.target.result.split(";");
        if(splittedvalue.length === 3){
          // console.log(splittedvalue);
          setNSUSRID(splittedvalue[0]);
          setNSDVCID(splittedvalue[1]);
          setconnectionToken(splittedvalue[2]);
          setformSwitch(false);
        }
        else{
          dispatchnewalert(dispatch, "warning", "File content is invalid");
        }
      }
      else{
        dispatchnewalert(dispatch, "warning", "File content is invalid");
      }
    }
    reader.onerror = _ => {
      dispatchnewalert(dispatch, "error", "Error reading file");
    };
    reader.readAsText(file);
  }

  return (
    <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className='w-full h-full absolute flex items-center'>
        <div id='div_alerts_container' ref={scrollDivAlerts}>
            {alerts.map((al: any, i: number) => {
            return(
                <Alert key={i} al={al} />
            )
            })}
        </div>
        <button onClick={() => { settoggleSettingsModal(!toggleSettingsModal) }} className='absolute bottom-[10px] left-[10px] p-[10px] rounded-[7px] z-[10]'>
            <MdSettings className='text-accent-tertiary' style={{ fontSize: "25px" }} />
        </button>
        {toggleSettingsModal && (
          <ReusableModal shaded={true} padded={false} children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[450px] max-h-[150px] rounded-[7px] p-[20px] pb-[5px] flex flex-col'>
              <div className='w-full flex flex-row'>
                <div className='flex flex-1'>
                  <span className='text-[16px] font-semibold'>Reset Settings</span>
                </div>
                <div className='w-fit'>
                  <button onClick={() => { settoggleSettingsModal(false); }}><MdClose /></button>
                </div>
              </div>
              <div className='w-full flex flex-1 flex-col items-center justify-center gap-[3px]'>
                  <button onClick={OpenNeonRemote} className='h-[30px] w-full bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Open Neon Remote</span>
                  </button>
                  <button onClick={OpenTerminal} className='h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Open Terminal</span>
                  </button>
              </div>
            </motion.div>
          } />
        )}
        {!toggleSettingsModal && (
            <ReusableModal shaded={false} padded={false} children={
                <motion.div
                initial={{
                    maxHeight: "0px"
                }}
                animate={{
                    maxHeight: "660px"
                }}
                transition={{
                    delay: 1,
                    duration: 1
                }}
                className='border-[1px] bg-white w-[95%] h-[95%] max-w-[700px] shadow-md rounded-[10px] overflow-y-hidden'>
                    <div className='w-full h-full p-[25px] flex flex-col gap-[10px]'>
                        <div className='w-full flex flex-row'>
                            <img src={NeonPOS.src} className='h-[60px]' />
                        </div>
                        <div className='w-full flex flex-col justify-center items-center'>
                            <span className='text-[30px] font-semibold font-Inter'>Welcome to Neon POS</span>
                            <span className='text-[11px] font-Inter'>Powered by Neon Service</span>
                        </div>
                        <div className='w-full flex flex-col pt-[20px] pl-[20px] pr-[20px]'>
                            <p className='text-[14px] font-Inter text-justify'>Introducing Neon POS, the innovative Point-of-Sales system powered by cutting-edge software, Neon Service. Seamlessly integrating state-of-the-art solutions, Neon POS offers streamlined transactions and instant insights, transforming businesses.</p>
                        </div>
                        <div className='w-full flex flex-col pt-[10px] pl-[20px] pr-[20px] gap-[20px]'>
                            <div className='w-full flex flex-row gap-[10px] items-center justify-center'>
                              <motion.button animate={{ color: !formSwitch ? "black" : "grey" }} onClick={() => { setformSwitch(false); }} className='text-[14px] font-Inter font-semibold'>Enter setup details</motion.button>
                              <span className='text-[14px] font-Inter'>or</span>
                              <motion.button animate={{ color: formSwitch ? "black" : "grey" }} onClick={() => { setformSwitch(true); }} className='text-[14px] font-Inter font-semibold'>Import setup file</motion.button>
                            </div>
                            <div className='flex flex-col w-full pl-[20px] pr-[20px] gap-[10px]'>
                                <input ref={importFileRef} type='file' hidden onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  if(e.target.files[0].name.split(".")[e.target.files[0].name.split(".").length - 1] === "nsrv"){
                                    // console.log(e.target.files[0].name.split(".")[e.target.files[0].name.split(".").length - 1]);
                                    readFile(e.target.files[0]);
                                  }
                                  else{
                                    dispatchnewalert(dispatch, "warning", "Invalid file type");
                                  }
                                }} />
                                {formSwitch ? (
                                  <div className='w-full flex flex-col h-[194px]'>
                                    <div onClick={() => {
                                      if(importFileRef.current){
                                        importFileRef.current.click();
                                      }
                                    }} className='flex flex-col items-center justify-center w-full h-full border-[2px] rounded-[7px] border-dashed select-none cursor-pointer gap-[4px]'>
                                      <CiFileOn style={{ fontSize: "80px", color: "grey" }} />
                                      <span className='font-Inter text-[12px] text-gray-500'>Import your .nsrv file</span>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className='flex flex-col w-full gap-[5px]'>
                                        <span className='text-[12px] font-Inter font-semibold'>Neon Service User ID</span>
                                        <input placeholder='eg: USR_00000_0000000000' value={NSUSRID} onChange={(e) => { setNSUSRID(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                    </div>
                                    <div className='flex flex-col w-full gap-[5px]'>
                                        <span className='text-[12px] font-Inter font-semibold'>Neon Service Device ID</span>
                                        <input placeholder='eg: USR_00000_0000000000' value={NSDVCID} onChange={(e) => { setNSDVCID(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                    </div>
                                    <div className='flex flex-col w-full gap-[5px]'>
                                        <span className='text-[12px] font-Inter font-semibold'>Connection Token</span>
                                        <input placeholder='Input connection token of this device provided in Neon Remote' value={connectionToken} onChange={(e) => { setconnectionToken(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]' />
                                    </div>
                                  </>
                                )}
                                <div className='flex flex-col w-full gap-[5px]'>
                                    <span className='text-[12px] font-Inter font-semibold'>Setup Type</span>
                                    <select value={SetupType} onChange={(e) => { setSetupType(e.target.value) }} className='font-Inter bg-transparent border-[1px] h-[35px] pl-[10px] pr-[10px] outline-none text-[12px] w-full rounded-[4px]'>
                                        <option defaultChecked value="POS">POS</option>
                                        <option value="Portable">Portable</option>
                                    </select>
                                </div>
                                <div className='flex flex-flex w-full gap-[5px] pt-[10px]'>
                                    <button disabled={isVerifying} onClick={VerifyCredentials} className='flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-accent-tertiary cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                                        <span className='text-[12px]'>{isVerifying ? "...Verifying Credentials" : "Verify and Confirm"}</span>
                                    </button>
                                    <button disabled={isVerifying} onClick={CancelSetup} className='flex items-center justify-center h-[32px] font-Inter pl-[12px] pr-[12px] bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                                        <span className='text-[12px]'>{isShuttingdown ? "...Shutting down": "Cancel Setup"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            } />
        )}
    </div>
  )
}

export default Formtab