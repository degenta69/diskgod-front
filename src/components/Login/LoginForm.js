import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.email === "" || userInfo.password === "") {
      return setError("Please fill all the fields");
    }
    const loginReq = await axios
      .post(`http://localhost:8080/api/user/login`, userInfo)
      .catch((err) => {
        console.log(err);
        if(err.toString().indexOf('401')>-1){
          return setError("Invalid Credentials ");
        }
        if(err.toString().indexOf('500')>-1){
          return setError("try again later");
        }
        if(err.toString().indexOf('400')>-1){
          return setError("Invalid Credentials ");

        }
        if(err.toString().indexOf('404')>-1){
          return setError("No user found");

        }
        if(err.toString().indexOf('408')>-1){
          return setError("try again later"); 

        }
      });

    if (loginReq) {
      localStorage.setItem(
        "userToken",
        JSON.stringify({ access: loginReq.data.token })
      );
      nav("/home");
      setError(null);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div>
          <h5 className={`label-input ${error ? `error-label-input` : ""}`}>
            EMAIL {error ? <span>-{error}</span> : ""}
          </h5>
          <input
            onChange={handleChange}
            name="email"
            className="input-2g-os5"
            aria-label="email"
            type={"email"}
          />
        </div>
        <div>
          <h5 className={`label-input ${error ? `error-label-input` : ""}`}>
            PASSWORD {error ? <span>-{error}</span> : ""}
          </h5>
          <input
            onChange={handleChange}
            name="password"
            className="input-2g-os5"
            aria-label="password"
            type={"password"}
          />
          <button className="forgetPassword-button">
            <div className="forgetPassword">Forgot your password?</div>
          </button>
        </div>
        <div>
          <button onClick={handleSubmit} className="login-button">
            <div className="login-text">Login</div>
          </button>
          <div className="flex need-an-account items-center">
            <span>need an account?</span>
            <button
              onClick={() => {
                nav("/auth/signup");
              }}
              className="forgetPassword-button register-btn p-0 m-0"
            >
              <div className="forgetPassword">register</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
