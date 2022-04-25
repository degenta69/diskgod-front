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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverDetails.render]);

  // console.log(serverDetails, 'serverDetails');
  return serverDetails.isHome?(
    <>
    
    <ServerNavbar isHome/>
    <Box sx={{height:'calc(100vh - 7vh)'}} className="searchUserWrapper m-6">
    <SearchUser/>
    </Box>
    </>
  ):(
    <>
    
    <ServerNavbar serverDetail={JSON.parse(serverDetails.newState)}/>
    
    <Box sx={{height: 'calc(100vh - 7vh)',overflow:'hidden',maxHeight:'100%'}} className="  ">
    <LoggedInUserChatingScreen serverDetail={newServerDetail}/>
    </Box>
    </>
  );
};

export default ChatScreen;
