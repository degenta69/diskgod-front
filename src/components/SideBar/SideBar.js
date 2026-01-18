import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import ServerListings from "../ServerListings/ServerListings";
import "./SideBar.css";

import { addHomeDetail } from "../../state/serverDetailData/serverDetailSlice";
import instance from "../../api/axios";
import { setOpen } from "../../state/counter/modalShowSlice";

const SideBar = ({ horizontal = false }) => {
  const [servers, setservers] = useState([]);
  const rerender = useSelector((state) => state.serverDetail.rerender);

  useEffect(() => {
    const getServer = async () => {
      const res = await instance.get("api/chats");
      const data = res.data;
      setservers(data);
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

  // Horizontal layout for mobile (top bar)
  if (horizontal) {
    return (
      <div className="flex flex-row gap-3 w-full items-center overflow-x-auto hideScrollbar">
        <div onClick={setisHome} className="shrink-0">
          <ServerIconButton
            unreadMessageCount={servers.length}
            profile
            show={true}
            isActive={isHome}
          />
        </div>
        <div className="w-[2px] h-8 bg-slate-700 rounded-full shrink-0"></div>
        <ServerListings data={servers} horizontal />
        <ServerIconButton onClick={handleAddGroup} add show={false} />
      </div>
    );
  }

  // Vertical layout for desktop (sidebar)
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
