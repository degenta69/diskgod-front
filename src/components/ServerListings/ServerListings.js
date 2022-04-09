import React, { useEffect } from "react";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import Tooltip from '@mui/material/Tooltip'
import { useDispatch, useSelector } from "react-redux";
import { createAction } from "@reduxjs/toolkit";
import { addServerDetail } from "../../state/serverDetailData/serverDetailSlice";



const ServerListings = ({ data }) => {

    const dispatch = useDispatch();
const serverDetails = useSelector(state => state.serverDetail)
  const handleServerData = async(server) => {
    //  const action = createAction(addServerDetail)
    //  action(server)
    dispatch(addServerDetail({...server}))
    const data = await JSON.parse(serverDetails.newState)
    //   console.log('clicked',data,'current',server)

  }

  return (
    <>
      {data.map((server, key) => {
        return (
          <div  key={key} onClick={()=>{handleServerData(server)}} className="z-40 ">
            {/* <Tooltip placement="right" arrow title={server.chatName}> */}
            <ServerIconButton data={server} show={true} usersNumber={server.users.length} />
            {/* </Tooltip> */}
          </div>
        );
      })}
    </>
  );
};

export default ServerListings;
