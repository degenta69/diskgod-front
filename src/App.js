import "./App.css";
import Main from "./pages/Main";
import AuthPage from "./pages/AuthPage";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App h-full text-center">
        <Outlet/>
        {/* loading skeleton */}
        {/* react router
      /
      /auth
         nest /login
         nest /signup */}
      </div>
    </>
  );
}

export default App;
