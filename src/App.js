import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Main from "./pages/Main";
import { useEffect } from "react";
import { fetchUserInfo } from "./state/userInfoData/userInfoSlice";

import React from "react";
import "./index.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import SignUp from "./components/SignUp/SignUp";
// import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";

function App() {

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const token = localStorage.getItem('diskGodUserToken');

  useEffect(() => {
    if (token) {
      // let s = JSON.parse(token.access)
      // console.log('fired',s)
      dispatch(fetchUserInfo("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njc5OTcwMmIwMTY3MTk5NzdmMzU0YmUiLCJpYXQiOjE3MTk0MjYzMTIsImV4cCI6MTcyMDAzMTExMn0.5wZW2Z-GnOiBkSs-YgsDzhWimHfCWYdhaiFujEfn5Uc"));
    }
  }, [userInfo, token,dispatch]);

  
  return (
    <Router>
    <Routes>
      <Route path="/" >
        <Route
          path="/"
          element={
            <Navigate to="/home" replace />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to="/home" replace />
          }
        />
      </Route>
      <Route
        path="/home"
        element={
          <div className="App h-full text-center">
            <Main />
          </div>
        }
      />
      <Route path="/auth" element={<div className="App h-full text-center"><AuthPage /></div>}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
