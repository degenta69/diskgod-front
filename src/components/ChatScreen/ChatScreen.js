import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoggedInUserChatingScreen from "../LoggedInUserChatingScreen/LoggedInUserChatingScreen";
import SearchUser from "../SearchUser/SearchUser";
import ServerNavbar from "../ServerNavbar/ServerNavbar";
import "./ChatScreen.css";

const ChatScreen = () => {

  const serverDetails = useSelector((state) => state.serverDetail);
  const [newServerDetail, setNewServerDetail] = useState(serverDetails);

  useEffect(() => {
    let data = JSON.parse(serverDetails.newState)
    setNewServerDetail(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverDetails.render]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Navbar - shrinks to content */}
      <div className="shrink-0">
        {serverDetails.isHome ? (
          <ServerNavbar isHome />
        ) : (
          <ServerNavbar serverDetail={JSON.parse(serverDetails.newState)} />
        )}
      </div>

      {/* Content - takes remaining space */}
      <div className="flex-1 overflow-hidden">
        {serverDetails.isHome ? (
          <Box className="searchUserWrapper h-full overflow-auto p-4">
            <SearchUser />
          </Box>
        ) : (
          <LoggedInUserChatingScreen serverDetail={newServerDetail} />
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
