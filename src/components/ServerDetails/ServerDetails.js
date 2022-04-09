import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const ServerDetails = () => {
  const serverDetails = useSelector((state) => state.serverDetail);

  const [data, setdata] = useState(serverDetails.isHome ? [] : []);

  useEffect(() => {
    if (!serverDetails.isHome) {
      const data = JSON.parse(serverDetails.newState);
    //   console.log('hello',data)
        setdata(data);
    } else {
        const data = serverDetails;
        // console.log(data)
      setdata(data);
    }
  }, [serverDetails]);

  return serverDetails.isHome ? (
    <></>
  ) : (
    <>
      <div>{data.chatName}</div>
    </>
  );
};

export default ServerDetails;
