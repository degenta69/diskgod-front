import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ServerIconButton from '../ServerIconButton/ServerIconButton'
import ServerListings from '../ServerListings/ServerListings';

import "./SideBar.css"


const SideBar = () => {
  const [servers, setservers] = useState([
    {
      isGroupChat: Boolean,
      users: [
        {
          name: "John Doe",
          email: "jon@example.com",
        },
      ],
      _id: "617a518c4081150716472c78",
      chatName: "Friends",
      groupAdmin: {
        name: "Guest User",
        email: "guest@example.com",
      },
    },
  ]);
  useEffect(() => {
    const getServer = async()=>{

      const res = await axios.get('http://localhost:8080/chats')
      const data = res.data
      // console.log(data)
      setservers(data);
    }
    getServer();
  }, []);
  return (
    <div className="flex flex-col MAXlg:flex-row gap-2">
          <ServerIconButton profile show={true}/>
          <div className="listItem-3SmSlK MAXlg:flex"><div className="guildSeparator-a4uisj"></div></div>
          <ServerListings data={servers}/>
    </div>
  )
}

export default SideBar