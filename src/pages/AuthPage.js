import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import BackgroundSVG from "../SVG/BackgroundSVG";
import {useMediaQuery} from 'react-responsive';

const AuthPage = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const location = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    // console.log(location)
    if(location.pathname === '/auth/login'){
      document.title = 'Login'
    }else{  
      document.title = 'Sign Up'
    }
    if(localStorage.getItem('diskGodUserToken')){
      nav('/home')
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <div className="h-full w-full relative flex">
        <BackgroundSVG className='fixed z-0 top-0 left-0 w-full h-full'/>
      <div className={`m-auto ${isTabletOrMobile?'h-screen w-screen':location.pathname==='/auth/signup'?'w-35':`w-7/12`}  rounded p-8 z-10 h-max bg-serverBG`}>
        <Outlet/>
        {/* <Login /> */}
        {/* <SignUp /> */}
      </div>
    </div>
  );
};

export default AuthPage;
