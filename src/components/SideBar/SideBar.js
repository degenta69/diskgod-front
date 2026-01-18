import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import ServerListings from "../ServerListings/ServerListings";
import "./SideBar.css";

import { addHomeDetail } from "../../state/serverDetailData/serverDetailSlice";
import instance from "../../api/axios";
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
  const { isHome } = useSelector((state) => state.serverDetail);

  const setisHome = () => {
    dispatch(addHomeDetail({}));
  };

  const handleAddGroup = async () => {
    dispatch(setOpen())
  }

  return (
    <div className="flex flex-col gap-4 w-full items-center">
      <div onClick={setisHome} className="w-full flex justify-center">
        <ServerIconButton
          unreadMessageCount={servers.length}
          profile
          show={true}
          isActive={isHome}
        />
      </div>
      <div className="w-8 h-[2px] bg-slate-700 rounded-full my-2"></div>
      <ServerListings data={servers} />
      <ServerIconButton onClick={handleAddGroup} add show={false} />
    </div>
  );
};

export default SideBar;
