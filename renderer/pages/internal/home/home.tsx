import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { AiOutlineLogout } from "react-icons/ai";
import { MdAccountBox, MdAccountCircle, MdClose, MdDashboard, MdInventory, MdLock, MdOutlineRestaurantMenu, MdSettings } from "react-icons/md";
import Routes from './routes';
import { routing } from '../../../utils/routesoptions';
import { AlertsItem, AuthenticationInterface, SettingsInterface } from '../../../helpers/typings/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTHENTICATION } from '../../../helpers/redux/types/types';
import { authenticationstate } from '../../../helpers/redux/types/states';
import Alert from '../../../components/widgets/alert';
import { dispatchclearalerts, dispatchnewalert } from '../../../helpers/reusables/alertdispatching';
import { CloseSSENotifications, SSENotificationsTRequest } from '../../../helpers/https/sse';
import { GetFilesListResponseNeonRemote } from '../../../helpers/https/requests';
import NeonPOSSVG from '../../../assets/NeonPOS_BG.svg'
import { IoReceiptSharp } from 'react-icons/io5';
import ReusableModal from '../../../components/modals/reusablemodal';

function Home() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const dispatch = useDispatch();
  const router = useRouter();

  const [currenttab, setcurrenttab] = useState<string>("");
  const [toggleTroubleshoot, settoggleTroubleshoot] = useState<boolean>(false);

  useEffect(() => {
    dispatchclearalerts(dispatch);
  },[]);

  useEffect(() => {
    if(!authentication.auth){
      router.push("/home");
    }
  }, [authentication]);

  const LogoutProcess = () => {
    CloseSSENotifications();
    dispatchclearalerts(dispatch);
    dispatch({
      type: SET_AUTHENTICATION,
      payload: {
        authentication: {
          auth: false,
          user: authenticationstate
        }
      }
    })
    // router.push("/internal/auth/login");
  }

  const scrollDivAlerts = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(scrollDivAlerts.current){
      const scrollHeight = scrollDivAlerts.current.scrollHeight;
      const clientHeight = scrollDivAlerts.current.clientHeight;
      const maxScrollTop = scrollHeight - clientHeight
      scrollDivAlerts.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  },[alerts, scrollDivAlerts]);

  useEffect(() => {
    if(settings){
      SSENotificationsTRequest(dispatch, authentication, settings);

      window.ipc.on('get-directories-output', (event: string) => {
        const parseddirs = JSON.parse(event);
        const finalpayload = {
          deviceID: settings.deviceID,
          toID: settings.userID,
          ...parseddirs
        }
        GetFilesListResponseNeonRemote({
          token: JSON.stringify(finalpayload)
        });
      });
    }
  },[settings])

  const OpenNeonRemote = () => {
    // window.ipc.send('execute-command', 'gnome-terminal');
    // settoggleSettingsModal(false);
    window.ipc.send('execute-command', 'xdg-open https://neonremote.netlify.app');
    settoggleTroubleshoot(false);
  }

  const RestartReportWindow = () => {
    if(settings.setup === "POS"){
      window.ipc.send('restart-report-window', '');
      settoggleTroubleshoot(false);
    }
    else{
      dispatchnewalert(dispatch, "warning", "Action unavailable, current setup is not POS type.")
    }
  }

  const RestartReceiptWindow = () => {
    if(settings.setup === "POS"){
      window.ipc.send('restart-receipt-window', '');
      settoggleTroubleshoot(false);
    }
    else{
      dispatchnewalert(dispatch, "warning", "Action unavailable, current setup is not POS type.")
    }
  }

  return (
    authentication.auth && (
      <div style={{ background: `url(${NeonPOSSVG.src})`, backgroundSize: "cover", backgroundPosition: "bottom", backgroundRepeat: "no-repeat" }} className={`w-full h-full bg-primary absolute flex flex-1 flex-row`}>
        {toggleTroubleshoot && (
          <ReusableModal shaded={true} padded={false} children={
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className='bg-white w-[95%] h-[95%] max-w-[450px] max-h-[180px] rounded-[7px] p-[20px] pb-[5px] flex flex-col'>
              <div className='w-full flex flex-row'>
                <div className='flex flex-1'>
                  <span className='text-[16px] font-semibold'>Troubleshoot Settings</span>
                </div>
                <div className='w-fit'>
                  <button onClick={() => { settoggleTroubleshoot(false); }}><MdClose /></button>
                </div>
              </div>
              <div className='w-full flex flex-1 flex-col items-center justify-center gap-[3px]'>
                  <button onClick={OpenNeonRemote} className='h-[30px] w-full bg-green-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Open Neon Remote</span>
                  </button>
                  <button onClick={RestartReceiptWindow} className='h-[30px] w-full bg-green-700 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Restart Receipt Window</span>
                  </button>
                  <button onClick={RestartReportWindow} className='h-[30px] w-full bg-orange-500 cursor-pointer shadow-sm text-white font-semibold rounded-[4px]'>
                    <span className='text-[14px]'>Restart Report Window</span>
                  </button>
              </div>
            </motion.div>
          } />
        )}
        <div id='div_alerts_container' ref={scrollDivAlerts}>
          {alerts.map((al: any, i: number) => {
            return(
              <Alert key={i} al={al} />
            )
          })}
        </div>
        <div className='flex bg-accent-tertiary flex flex-1 flex-col max-w-[80px] items-center pt-[15px]'>
            <div className='bg-transparent w-full flex flex-1 flex-col items-center p-[7px] pr-[0px] gap-[7px]'>
              {authentication.user.permissions.includes("navigate_dashboard") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.DASHBOARD_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.DASHBOARD_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.DASHBOARD_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdDashboard style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Dashboard</span>
                </motion.button>
              )}
              {authentication.user.permissions.includes("navigate_menu") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.MENU_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.MENU_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.MENU_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdOutlineRestaurantMenu style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Menu</span>
                </motion.button>
              )}
              {authentication.user.permissions.includes("navigate_orders") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.ORDERS_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.ORDERS_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.ORDERS_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <IoReceiptSharp style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Orders</span>
                </motion.button>
              )}
              {authentication.user.permissions.includes("navigate_inventory") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.INVENTORY_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.INVENTORY_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.INVENTORY_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdInventory style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Inventory</span>
                </motion.button>
              )}
              {(authentication.user.permissions.includes("navigate_permissions") || authentication.user.accountType === "Admin") && ( //authentication.user.permissions.includes("navigate_permissions")
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.PERMISSIONS_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.PERMISSIONS_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.PERMISSIONS_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdLock style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Permissions</span>
                </motion.button>
              )}
              {authentication.user.permissions.includes("navigate_users") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.USERS_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.USERS_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.USERS_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdAccountBox style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Users</span>
                </motion.button>
              )}
              {authentication.user.permissions.includes("navigate_account") && (
                <motion.button
                animate={{
                  backgroundColor: currenttab === routing.ACCOUNT_ROUTE ? "white" : "transparent",
                  color: currenttab === routing.ACCOUNT_ROUTE ? "#616161" : "white"
                }}
                whileHover={{
                  backgroundColor: "white",
                  color: "#616161"
                }}
                onClick={() => {
                  setcurrenttab(routing.ACCOUNT_ROUTE);
                }}
                className='text-white w-full h-[70px] rounded-tl-[10px] rounded-bl-[10px] flex flex-col gap-[5px] items-center justify-center'>
                  <MdAccountCircle style={{ fontSize: "30px" }} />
                  <span className='text-[12px]'>Account</span>
                </motion.button>
              )}
            </div>
            <div className='bg-transparent w-full h-[200px] flex flex-col items-center justify-end p-[7px]'>
              <motion.button
              initial={{
                color: "white"
              }}
              whileHover={{
                background: "white",
                color: "black"
              }}
              onClick={() => { settoggleTroubleshoot(!toggleTroubleshoot) }} className='text-red w-full h-[70px] rounded-[10px] flex items-center justify-center'>
                <MdSettings style={{ fontSize: "27px" }} />
              </motion.button>
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
  )
}

export default Home