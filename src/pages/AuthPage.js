import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import FluidBackground from "../components/FluidBackground";
import { useMediaQuery } from 'react-responsive';

const AuthPage = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const location = useLocation()
  const nav = useNavigate()
  useEffect(() => {
    // console.log(location)
    if (location.pathname === '/auth/login') {
      document.title = 'Login'
    } else {
      document.title = 'Sign Up'
    }
    if (localStorage.getItem('diskGodUserToken')) {
      nav('/home')
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);
  return (
    <div className="h-full w-full relative flex">
      <FluidBackground />
      <div className={`m-auto ${isTabletOrMobile ? 'w-11/12 my-auto' : location.pathname === '/auth/signup' ? 'w-35' : `w-7/12`} rounded-3xl p-8 z-10 h-max bg-slate-900/30 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] skew-y-0`}>
        <Outlet />
        {/* <Login /> */}
        {/* <SignUp /> */}
      </div>
    </div>
  );
};

export default AuthPage;
