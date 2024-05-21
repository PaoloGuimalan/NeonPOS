import React, { useEffect, useRef, useState } from 'react'
import Login from './internal/auth/login'
import { AlertsItem, AuthenticationInterface, SettingsInterface } from '../helpers/typings/interfaces'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Alert from '../components/widgets/alert';
import Setup from './setup/setup';
import { SET_AUTHENTICATION, SET_SETTINGS } from '../helpers/redux/types/types';
import Pageloader from '../components/holders/pageloader';

export default function HomePage() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const settings: SettingsInterface = useSelector((state: any) => state.settings);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isSettingsDone, setisSettingsDone] = useState<boolean | null>(null);
  const [isAuthLoading, setisAuthLoading] = useState<boolean>(true);

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
    if(authentication.auth){
      router.push("/internal/home/home");
    }
  }, [authentication]);

  useEffect(() => {
    const settingsstorage = localStorage.getItem("settings");

    if(settingsstorage){
      setisSettingsDone(true);
      dispatch({
        type: SET_SETTINGS,
        payload: {
          settings: JSON.parse(settingsstorage)
        }
      });
    }
    else{
      setisSettingsDone(false);
    }
  }, []);

  useEffect(() => {
    const settingsstorage = localStorage.getItem("settings");

    if(settingsstorage){
      if(!isSettingsDone){
        if(JSON.parse(settingsstorage).setup === "POS"){
          window.ipc.send("enable-external", JSON.parse(settingsstorage).setup);
        }
      }
      setisSettingsDone(true);
    }
    else{
      setisSettingsDone(false);
    }
  }, [settings]);

  useEffect(() => {
    const authenticationtoken = localStorage.getItem("authentication");
    if(authenticationtoken){
      dispatch({
        type: SET_AUTHENTICATION,
        payload: {
          authentication: {
            auth: true,
            user: JSON.parse(authenticationtoken).user
          }
        }
      })
      setisAuthLoading(false);
    }
    else{
      setisAuthLoading(false);
    }
  },[])

  return (
    <React.Fragment>
      <div id='div_alerts_container' ref={scrollDivAlerts}>
        {alerts.map((al: any, i: number) => {
          return(
            <Alert key={i} al={al} />
          )
        })}
      </div>
      {isSettingsDone !== null && (
        isSettingsDone ? (
          isAuthLoading ? (
            <Pageloader />
          ) : (
            <Login />
          )
        ) : (
          <Setup />
        )
      )}
    </React.Fragment>
  )
}
