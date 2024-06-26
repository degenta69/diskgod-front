import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import store,{ persistor } from "./state/store";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import AuthPage from "./pages/AuthPage";
import SignUp from "./components/SignUp/SignUp";
// import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <PersistGate loading={  null
        // <div className="mx-auto flex items-center w-full p-2" >
        // <Loader  border={10} />
        // </div>
      } persistor={persistor}>
        <App/>
      </PersistGate>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
