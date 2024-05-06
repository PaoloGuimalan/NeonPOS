import React, { useEffect, useRef, useState } from 'react'
import Login from './internal/auth/login'
import { AlertsItem, AuthenticationInterface } from '../helpers/typings/interfaces'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Alert from '../components/widgets/alert';
import Setup from './setup/setup';

export default function HomePage() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const alerts: AlertsItem[] = useSelector((state: any) => state.alerts);
  const router = useRouter();

  const [isSettingsDone, setisSettingsDone] = useState<boolean | null>(null);

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
    const settings = localStorage.getItem("settings");

    if(settings){
      setisSettingsDone(true);
    }
    else{
      setisSettingsDone(false);
    }
  }, []);

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
          <Login />
        ) : (
          <Setup />
        )
      )}
    </React.Fragment>
  )
}
