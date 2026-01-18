import React from "react";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import { useDispatch, useSelector } from "react-redux";
import { addServerDetail } from "../../state/serverDetailData/serverDetailSlice";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";

const ServerListings = ({ data, horizontal = false }) => {
  const dispatch = useDispatch();
  const { newState, isHome } = useSelector(state => state.serverDetail);

  // Parse current server safely
  let currentServerId = null;
  try {
    const currentServer = JSON.parse(newState);
    currentServerId = currentServer?._id;
  } catch (e) {
    // Silent fail
  }

  const handleServerData = async (server) => {
    dispatch(addServerDetail({ ...server }))
    dispatch(fetchMessagesByChatid(server._id))
  }

  return (
    <div className={`flex ${horizontal ? 'flex-row gap-3' : 'flex-col gap-2 w-full'} items-center`}>
      {data.map((server, key) => {
        const isActive = !isHome && currentServerId === server._id;
        return (
          <div
            key={key}
            onClick={() => { handleServerData(server) }}
            className={`z-40 ${horizontal ? 'shrink-0' : 'w-full flex justify-center'}`}
          >
            <ServerIconButton
              _id={server._id}
              data={server}
              show={true}
              unreadMessageCount={server.unreadCount || 0}
              isActive={isActive}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ServerListings;
