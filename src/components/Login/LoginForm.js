import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../state/userInfoData/userInfoSlice";
import instance from "../../api/axios";

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
  const dispatch = useDispatch()
  // const userDetails = useSelector(state => state.userInfo)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.email === "" || userInfo.password === "") {
      return setError("Please fill all the fields");
    }
    const loginReq = await axios
      .post(`/api/user/login`, userInfo)
      .catch((err) => {
        console.log(err);
        if (err.response.status.toString().indexOf('401') > -1) {
          return setError(err.response.data ? err.response.data : "Invalid Credentials ");
        }
        if (err.response.status.toString().indexOf('500') > -1) {
          return setError(err.response.data ? err.response.data : "try again later");
        }
        if (err.response.status.toString().indexOf('400') > -1) {
          return setError(err.response.data ? err.response.data : "Invalid Credentials ");

        }
        if (err.response.status.toString().indexOf('404') > -1) {
          return setError(err.response.data ? err.response.data : "No user found");

        }
        if (err.response.status.toString().indexOf('408') > -1) {
          return setError(err.response.data ? err.response.data : "try again later");

        }
      });

    if (loginReq) {
      dispatch(addUser({ user: loginReq.data.user, token: loginReq.data.token }))
      localStorage.setItem(
        "diskGodUserToken",
        JSON.stringify({ access: loginReq.data.token })
      );
      instance({
        headers: {
          Authorization: `Bearer ${loginReq.data.token}`
        }
      })
      nav("/home");
      // window.location.reload(); // Removed to rely on clean Redux state update
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
