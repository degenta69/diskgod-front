import React from "react";
import ServerIconButton from "../ServerIconButton/ServerIconButton";
import { useDispatch } from "react-redux";
import { addServerDetail } from "../../state/serverDetailData/serverDetailSlice";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";



const ServerListings = ({ data }) => {

    const dispatch = useDispatch();
// const serverDetails = useSelector(state => state.serverDetail)

  const handleServerData = async(server) => {
    dispatch(addServerDetail({...server}))
    // const selected = await JSON.parse(serverDetails.newState)
    dispatch(fetchMessagesByChatid(server._id))
      // console.log('clicked',selected,'current',server)
      document.getElementsByClassName('active-server')[0]?.classList.remove('active-server')
      document.getElementById(server._id)?.classList.add('active-server')

  }

  return (
    <>
      {data.map((server, key) => {
        return (
          <div  key={key} id={`serverData${server._id}`} onClick={()=>{handleServerData(server)}} className="z-40 ">
            {/* <Tooltip placement="right" arrow title={server.chatName}> */}
            <ServerIconButton _id={server._id} data={server} show={true} serversNumber={data.length} usersNumber={server.users.length} />
            {/* </Tooltip> */}
          </div>
        );
      })}
    </>
  );
};

export default ServerListings;
