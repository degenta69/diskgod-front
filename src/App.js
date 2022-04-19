import "./App.css";
import { Outlet } from "react-router-dom";
import Main from "./pages/Main";

function App() {
  
  return (
    <>
      <div className="App h-full text-center">
        {/* loading skeleton */}
        <Main/>
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
