import React, { useEffect } from 'react'
import Login from './internal/auth/login'
import { AuthenticationInterface } from '../helpers/typings/interfaces'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router';

export default function HomePage() {

  const authentication: AuthenticationInterface = useSelector((state: any) => state.authentication);
  const router = useRouter();

  useEffect(() => {
    if(authentication.auth){
      router.push("/internal/home/home");
    }
  }, [authentication]);

  return (
    <React.Fragment>
      <Login />
    </React.Fragment>
  )
}
