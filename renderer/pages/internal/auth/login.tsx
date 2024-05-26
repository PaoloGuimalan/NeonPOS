import React, { useEffect, useState } from 'react'
import { FcAssistant, FcUnlock } from 'react-icons/fc'
import NeonPOS from '../../../assets/NeonPOS.png'
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg'
import { LoginRequest } from '../../../helpers/https/requests';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTHENTICATION, SET_SETTINGS } from '../../../helpers/redux/types/types';
import { useRouter } from 'next/router';
import { dispatchnewalert } from '../../../helpers/reusables/alertdispatching';
import { MdArrowBackIos, MdClose, MdSettings } from 'react-icons/md';
import ReusableModal from '../../../components/modals/reusablemodal';
import { motion } from 'framer-motion';
import { settingsstate } from '../../../helpers/redux/types/states';
import { SavedAccountSessionsInterface, SettingsInterface } from '../../../helpers/typings/interfaces';
import Buttonloader from '../../../components/loaders/buttonloader';

function Login() {

  const settings: SettingsInterface = useSelector((state: any) => state.settings);

  const [accountID, setaccountID] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const [saveSession, setsaveSession] = useState<boolean>(false);

  const [savedAccountSessions, setsavedAccountSessions] = useState<SavedAccountSessionsInterface[]>([]);

  const [isFromSession, setisFromSession] = useState<boolean>(false);
  const [accountNamePreview, setaccountNamePreview] = useState<string>("");

  const [toggleSettingsModal, settoggleSettingsModal] = useState<boolean>(false);
  const [isLoggingIn, setisLoggingIn] = useState<boolean>(false);

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
    setisLoggingIn(true);
    LoginRequest({
      accountID,
      password,
      userID: settings.userID
    }).then((response) => {
      setisLoggingIn(false);
      if(response.data.status){
        if(response.data.result){
          const permissionsmapper = response.data.result[0].permissions.map((mp: any) => mp.permissionType);
          if(saveSession){
            const currentaccountsession = localStorage.getItem("account_sessions");
            if(currentaccountsession){
              const parsedcurraccountsessions: SavedAccountSessionsInterface[] = JSON.parse(currentaccountsession);
              if(parsedcurraccountsessions.length > 0){
                const accIDChecker = parsedcurraccountsessions.map((mp: SavedAccountSessionsInterface) => mp.accountID);
                if(!accIDChecker.includes(response.data.result[0].accountID)){
                  const JsonConvertedsessions = JSON.stringify([
                    ...parsedcurraccountsessions,
                    {
                      accountID: response.data.result[0].accountID,
                      accountName: response.data.result[0].accountName
                    }
                  ]);
                  localStorage.setItem("account_sessions", JsonConvertedsessions);
                }
              }
              else{
                const JsonConvertedsessions = JSON.stringify([
                  {
                    accountID: response.data.result[0].accountID,
                    accountName: response.data.result[0].accountName
                  }
                ]);
                localStorage.setItem("account_sessions", JsonConvertedsessions);
              }
            }
            else{
              const JsonConvertedsessions = JSON.stringify([
                {
                  accountID: response.data.result[0].accountID,
                  accountName: response.data.result[0].accountName
                }
              ]);
              localStorage.setItem("account_sessions", JsonConvertedsessions);
            }
          }
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
          localStorage.setItem("authentication", JSON.stringify({
            user: {
              ...response.data.result[0],
              permissions: permissionsmapper
            }
          }))
          router.push("/internal/home/home");
          dispatchnewalert(dispatch, "success", "Successfully logged in");
          return;
        }
      }
      else{
        dispatchnewalert(dispatch, "warning", "Credentials are incorrect");
      }

      // setaccountID("");
      setpassword("");
    }).catch((err) => {
      setisLoggingIn(false);
      console.log(err);
      dispatchnewalert(dispatch, "error", "Error logging in");
    })
  }

  const CheckSessions = () => {
    const accountsessions = localStorage.getItem("account_sessions");
    if(accountsessions){
      const parsedaccsessions = JSON.parse(accountsessions);
      setsavedAccountSessions(parsedaccsessions);
      // alert(JSON.stringify(parsedaccsessions, null, 4));
    }
  }

  const RemoveSession = (accountIDProp: string) => {
    const accountsessions = localStorage.getItem("account_sessions");
    if(accountsessions){
      const parsedaccsessions: SavedAccountSessionsInterface[] = JSON.parse(accountsessions);
      localStorage.setItem("account_sessions", JSON.stringify([...parsedaccsessions.filter((flt: SavedAccountSessionsInterface) => flt.accountID !== accountIDProp)]));
      setsavedAccountSessions([...parsedaccsessions.filter((flt: SavedAccountSessionsInterface) => flt.accountID !== accountIDProp)]);
      // alert(JSON.stringify(parsedaccsessions, null, 4));
    }
  }

  useEffect(() => {
    window.ipc.on('command-output', (event: string) => {
      dispatchnewalert(dispatch, "info", event);
    });
  
    window.ipc.on('command-error', (event: string) => {
      dispatchnewalert(dispatch, "error", event);
    });

    CheckSessions();
  },[]);

  const ResetSetup = () => {
    localStorage.removeItem("settings");
    dispatch({
      type: SET_SETTINGS,
      payload: {
        settings: settingsstate
      }
    })
    settoggleSettingsModal(false);
    window.ipc.send("close-external", "");
  }

  // const EnableBackdoor = () => {
  //   // window.ipc.send('execute-command', 'cd /home/neonpos/Documents/Projects/NeonSystems/NeonPOS_API && yarn run dev');
  //   window.ipc.send('execute-command-w-dir', JSON.stringify({
  //     cmd: "./rundev.sh",
  //     dir: "/home/neonpos/Documents/Projects/NeonSystems/NeonPOS_API"
  //   }));
  //   settoggleSettingsModal(false);
  // }

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

  const ShutdownSystem = () => {
    window.ipc.send('execute-command', 'systemctl poweroff');
  }
  
  return (
    <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className={`w-full h-full bg-primary absolute flex flex-1 flex-row font-Inter`}>
        <div className={`h-full bg-transparent flex flex-1 items-center justify-center`} >
          {savedAccountSessions.length > 0 && (
            <div className='bg-shade flex flex-col w-[95%] h-[95%] max-w-[1000px] max-h-[800px] p-[20px] gap-[10px]'>
              <span className='font-Inter font-semibold text-[16px] text-text-tertiary'>Recent Sessions</span>
              <div className='flex flex-row flex-wrap flex-1 overflow-y-auto gap-[10px]'>
                {savedAccountSessions.map((mp: SavedAccountSessionsInterface, i: number) => {
                  return(
                    <div key={i} title={`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`} className='cursor-pointer select-none bg-white flex flex-col h-[220px] w-[180px] p-[10px] pb-[20px] rounded-[7px] border-[1px] shadow-md items-center gap-[5px]'>
                      <div className='w-full h-[50px] relative -mb-[50px] flex justify-end'>
                        <div className='w-fit'>
                          <button onClick={() => { RemoveSession(mp.accountID) }}><MdClose /></button>
                        </div>
                      </div>
                      <div onClick={() => { setisFromSession(true); setaccountID(mp.accountID); setpassword(""); setaccountNamePreview(`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`); }} className='w-full flex flex-1 items-center justify-center'>
                        <div className='w-[130px] h-[130px] rounded-[130px] bg-accent-tertiary text-white flex items-center justify-center text-[50px] font-semibold'>
                          {mp.accountName.firstname[0]}{mp.accountName.lastname[0]}
                        </div>
                      </div>
                      <span onClick={() => { setisFromSession(true); setaccountID(mp.accountID); setpassword(""); setaccountNamePreview(`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`); }} className='text-[14px] font-semibold font-Inter text-center text-text-tertiary overflow-hidden truncate w-full pl-[5px] pr-[5px]'>
                        {`${mp.accountName.firstname} ${mp.accountName.middlename} ${mp.accountName.lastname}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div> {/**bg-secondary */}
        {toggleSettingsModal && (
          <ReusableModal shaded={true} padded={false} children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[450px] max-h-[200px] rounded-[7px] p-[20px] pb-[5px] flex flex-col'>
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
                  <button onClick={ResetSetup} className='h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Reset</span>
                  </button>
                  <button onClick={ShutdownSystem} className='h-[30px] w-full bg-red-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Shutdown</span>
                  </button>
              </div>
            </motion.div>
          } />
        )}
        <div className='h-full bg-transparent flex flex-1 justify-center items-center max-w-[600px] p-[20px]'>
          <button onClick={() => { settoggleSettingsModal(!toggleSettingsModal) }} className='absolute bottom-[10px] left-[10px] p-[10px] rounded-[7px]'>
            <MdSettings className='text-accent-tertiary' style={{ fontSize: "25px" }} />
          </button>
          <div className='bg-primary shadow-lg border-[1px] w-full max-w-[500px] h-full max-h-[700px] flex flex-col gap-[15px] justify-center items-center rounded-[10px] shadow-md p-[10px]'>
            <div className='w-full max-w-[370px] flex flex-col gap-[50px] items-center justify-start pb-[10px]'>
                <img src={NeonPOS.src} className='h-[100px]' />
                <span className='text-[20px] font-semibold text-accent-secondary'>Login</span>
            </div>
            {isFromSession && (
              <span className='text-[18px] text-accent-primary font-semibold font-Inter text-center text-text-tertiary overflow-hidden truncate w-full pl-[5px] pr-[5px]'>
                {accountNamePreview}
              </span>
            )}
            <div className='w-full max-w-[370px] flex flex-col gap-[15px]'>
              {!isFromSession && (
                <div className='border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row' >
                  <div className='w-[45px] flex items-center justify-center'>
                    <FcAssistant style={{ fontSize: "22px" }} />
                  </div>
                  <input placeholder='Employee ID' value={accountID} onChange={(e) => { setaccountID(e.target.value) }} className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
                </div>
              )}
              <div className='border-[1px] shadow-sm h-[45px] rounded-[7px] flex flex-row' >
                <div className='w-[45px] flex items-center justify-center'>
                  <FcUnlock style={{ fontSize: "22px" }} />
                </div>
                <input placeholder='Password' type='password' value={password} onChange={(e) => { setpassword(e.target.value); }} className='bg-transparent outline-none text-[14px] w-full h-full flex flex-1' />
              </div>
              {!isFromSession && (
                <div className='h-[25px] pl-[10px] pr-[10px] rounded-[7px] flex flex-row items-center justify-start w-full gap-[7px]' >
                  <input type='checkbox' checked={saveSession} onChange={(e) => { setsaveSession(e.target.checked) }} className='cursor-pointer bg-transparent outline-none text-[14px] h-full' />
                  <span className='text-[13px] mt-[2px]'>Save login session</span>
                </div>
              )}
            </div>
            <div className={`w-full max-w-[370px] ${isFromSession && "pt-[10px]"} flex flex-col items-center gap-[5px]`}>
                <button disabled={isLoggingIn} onClick={LoginProcess} className='bg-accent-secondary hover:bg-accent-hover cursor-pointer w-full max-w-[200px] shadow-sm h-[40px] text-white font-semibold rounded-[7px]'>
                  {isLoggingIn ? (
                    <Buttonloader size='14px' />
                  ) : (
                    <span>Login</span>
                  )}
                </button>
                {isFromSession && (
                  <button disabled={isLoggingIn} onClick={() => { setaccountID(""); setpassword(""); setisFromSession(false); setaccountNamePreview(""); }} className='pl-[10px] pr-[10px] bg-accent-tertiary flex flex-row items-center justify-start cursor-pointer w-full max-w-[150px] shadow-sm h-[35px] text-white rounded-[7px]'>
                    {isLoggingIn ? (
                      <Buttonloader size='14px' />
                    ) : (
                      <>
                        <div className='text-[14px] relative w-[20px] -mr-[10px]'>
                          <MdArrowBackIos />
                        </div>
                        <span className='text-[14px] flex w-[calc(100%-20px)] justify-center'>Back</span>
                      </>
                    )}
                  </button>
                )}
            </div>
          </div>
        </div>
    </div>
  )
}

export default Login