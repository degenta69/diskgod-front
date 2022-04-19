import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import ServerListings from "../ServerListings/ServerListings";
import "./SideBar.css";

import { addHomeDetail } from "../../state/serverDetailData/serverDetailSlice";
import instance from "../../axios";
import { setOpen } from "../../state/counter/modalShowSlice";

const SideBar = () => {
  const [servers, setservers] = useState([
    // {
    //   isGroupChat: Boolean,
    //   users: [
    //     {
    //       name: "John Doe",
    //       email: "jon@example.com",
    //     },
    //   ],
    //   _id: "617a518c4081150716472c78",
    //   chatName: "Friends",
    //   groupAdmin: {
    //     name: "Guest User",
    //     email: "guest@example.com",
    //   },
    // },
  ]);
  const rerender = useSelector((state) => state.serverDetail.rerender);
  useEffect(() => {
    const getServer = async () => {
      const res = await instance.get("api/chats");
      const data = res.data;
      // console.log(data)
      setservers(data);
      // console.log(servers.length)
    };
    getServer();
  }, [rerender]);
  const dispatch = useDispatch();
  // const userDetail = useSelector((state) => state.userInfo);
  const setisHome = () => {
    // const userInfo = await JSON.parse(userDetail.newUser)
    // dispatch(addHomeDetail({...userInfo}))
    document.getElementsByClassName('active-server')[0]?.classList.remove('active-server')
    document.getElementById('homeId')?.classList.add('active-server')

    dispatch(addHomeDetail({}));
    // console.log(userInfo)
  };
  const handleAddGroup = async () => {
    dispatch(setOpen())
  }
  return (
    <div className="flex flex-col MAXlg:flex-row gap-2">
      <div onClick={setisHome}>
        <ServerIconButton serverNumber={servers.length} profile show={true} />
      </div>
      <div className="listItem-3SmSlK MAXlg:flex">
        <div className="guildSeparator-a4uisj"></div>
      </div>
      <ServerListings data={servers} />
      <ServerIconButton onClick={handleAddGroup} add show={false} />
    </div>
  );
};

export default SideBar;
