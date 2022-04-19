import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoggedInUserChatingScreen from "../LoggedInUserChatingScreen/LoggedInUserChatingScreen";
import SearchUser from "../SearchUser/SearchUser";
import ServerNavbar from "../ServerNavbar/ServerNavbar";
import "./ChatScreen.css";
const ChatScreen = () => {
    
  const serverDetails = useSelector((state) => state.serverDetail);
  const [newServerDetail , setNewServerDetail] = useState(serverDetails);
  
  useEffect(() => {
   let data = JSON.parse(serverDetails.newState)
    setNewServerDetail(data)
  }, [serverDetails.render]);

  // console.log(serverDetails, 'serverDetails');
  return serverDetails.isHome?(
    <>
    
    <ServerNavbar isHome/>
    <Box sx={{marginTop:'5.5rem'}} className="searchUserWrapper m-6">
    <SearchUser/>
    </Box>
    </>
  ):(
    <>
    
    <ServerNavbar serverDetail={JSON.parse(serverDetails.newState)}/>
    
    <Box sx={{marginTop:'3.5rem',overflow:'hidden',maxHeight:'100%'}} className="  ">
    <LoggedInUserChatingScreen serverDetail={newServerDetail}/>
    </Box>
    </>
  );
};

export default ChatScreen;
