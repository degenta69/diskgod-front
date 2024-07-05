import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../state/userInfoData/userInfoSlice";
import { ApiRequestHandler } from "../../api/apiRepositery.ts";
import ApiMethods from "../../Models/ApiMethods";
import instance from "../../api/axios.js";

interface UserInfo {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (userInfo.email === "" || userInfo.password === "") {
      return setError("Please fill all the fields");
    }

    const onSuccess = (response: any) => {
      dispatch(setCurrentUser({ ...response.data.user }));
      localStorage.setItem(
        "diskGodUserToken",
        JSON.stringify({ access: response.data.token })
      );
      instance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      navigate("/home");
      window.location.reload();
      setError(null);
    };

    const onError = (error: any) => {
      console.error(error);
      if (error.status.toString().includes('401')) {
        setError(error.data ? error.data : "Invalid Credentials");
      } else if (error.status.toString().includes('500')) {
        setError(error.data ? error.data : "Try again later");
      } else if (error.status.toString().includes('400')) {
        setError(error.data ? error.data : "Invalid Credentials");
      } else if (error.status.toString().includes('404')) {
        setError(error.data ? error.data : "No user found");
      } else if (error.status.toString().includes('408')) {
        setError(error.data ? error.data : "Try again later");
      }
    };

    await ApiRequestHandler({
      url: `/api/user/login`,
      method: ApiMethods.POST,
      requestBody: userInfo,
      fnSuccessCallback: onSuccess,
      fnErrorCallback: onError
    });
  };

  return (
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
              navigate("/auth/signup");
            }}
            className="forgetPassword-button register-btn p-0 m-0"
          >
            <div className="forgetPassword">register</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
