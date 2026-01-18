import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../state/userInfoData/userInfoSlice";
import instance from "../../api/axios";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [userInfo, setuserInfo] = useState({
    name: "",
    email: "",
    password: "",
    dob: "2022-01-01",
  });

  const handleChange = (e) => {
    setuserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userInfo);
    try {
      const response = await axios.post(`/api/user/signup`, userInfo); // Changed loginReq to response
      // console.log(response);
      localStorage.setItem("diskGodUserToken", JSON.stringify({ access: response.data.token }));
      instance({
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
      dispatch(addUser({ user: response.data.user, token: response.data.token })); // Added dispatch
      navigate("/home"); // Changed nav to navigate
      setError(null); // Added setError(null)
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred during signup.");
      // Optionally, navigate to login or show error message
      // navigate("/login"); // Removed this line as per instruction
    }
  };

  return (
    <>
      <div className="flex gap-2 flex-col">
        <p className="font-black text-2xl text-white"> Create an account </p>
        <span style={{ color: "#b9bbb0" }} className="text-base ">
          We're so exited to see you again!
        </span>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h5 className="label-input">EMAIL</h5>
          <input onChange={handleChange} name="email" className="input-2g-os5" aria-label="email" type={"email"} />
        </div>
        <div>
          <h5 className="label-input">USERNAME</h5>
          <input onChange={handleChange} name="name" className="input-2g-os5" aria-label="username" type={"text"} />
        </div>
        <div>
          <h5 className="label-input">PASSWORD</h5>
          <input
            onChange={handleChange}
            name="password"
            className="input-2g-os5"
            aria-label="password"
            type={"password"}
          />
        </div>
        <div>
          <h5 className="label-input">Date of Birth</h5>
          <input onChange={handleChange} name='dob' className="input-2g-os5" aria-label="dob" type={"date"} />
        </div>
        <div>
          <button onClick={handleSubmit} className="login-button">
            <div className="login-text">Continue</div>
          </button>
          <div className="flex need-an-account items-center">
            <button
              onClick={() => {
                navigate("/auth/login");
              }}
              className="forgetPassword-button register-btn p-0 m-0"
            >
              <div className="forgetPassword">already have an account?</div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
