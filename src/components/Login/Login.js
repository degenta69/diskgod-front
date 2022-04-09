import React from "react";
import LoginForm from "./LoginForm";
import "./Login.css";
const Login = () => {
  return (
    <div className="flex flex-auto h-full flex-row m-auto">
      <div className="flex-grow flex flex-col w-3/5 gap-4 ">
        <div className="flex gap-2 flex-col">
          <p className="font-black text-2xl text-white"> Welcome Back! </p>
          <span style={{ color: "#b9bbb0" }} className="text-base ">
            We're so exited to see you again!
          </span>
        </div>
        <LoginForm />
      </div>
      <div className="m-8 MAXmd:hidden div-login-hid flex-grow-0 MAXlg:invisiblhidee">
        <div className=""></div>
      </div>
      <div className="flex-grow div-login-hid MAXmd:hidden w-2/5 flex-col flex">
        <div className="qr-code-wrapper">
           
          <img src="/images/dummy-qr-code.png" className="" alt="qr code" />{" "}

        </div>
        <div className="qr-text-wrapper">
          <p className="qr-text">Login With QR code</p>
          <p className="qr-text-second">Scan this with <span> Google Lens </span>to get Rick Rolled</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
