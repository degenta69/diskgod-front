import React, { useEffect, useRef, useState } from "react";
import SendMessageInput from "../SendMessageInput/SendMessageInput";
import { Box } from "@material-ui/core";
import "./LoggedInUserChatingScreen.css";
import {Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
// import { textTransform } from "@mui/system";
// import ScrollableFeed from "react-scrollable-feed";
import {
  getDateFormat
} from "../../utils/messageUtils";
// import io from "socket.io-client";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";
import socket, { socketOpen } from "../../socket/socketioLogic";
// import {  } from "../../state/messageData/messageDataSlice";

import Lottie from "lottie-react";
import typingAnimationData from "../../animations/typing.json";
dayjs.extend(LocalizedFormat);
export const BlackTooltip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    sx={{
      right: {
        sm: "0",
        lg: "-10px",
      },
      bottom: "-10rem",
    }}
    className=" font-bold "
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#1c1d1e",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#1c1d1e",
    color: "#bdbdbd",
    fontSize: "14px",
    FontWeight: "bold",
    right: "-2px",
    textTransform: "capitalize",
  },
  [theme.breakpoints.down("md")]: {
    [`& .${tooltipClasses.tooltip}`]: {
      bottom: "-10px",
      right: "0",
    },
  },
}));
var selectedChatCompare;

const LoggedInUserChatingScreen = () => {
  const sendMessageInput = useRef();
  // const serverInfo = useSelector((state) => state.serverDetail);
  // const [serverDetail, setserverDetail] = useState([]);

  // useEffect(() => {
  //   let data = JSON.parse(serverInfo.newState);
  //   setserverDetail(data);
  // }, [serverInfo.newState, serverInfo.render]);

  var userInfo = useSelector((state) => state.userInfo);
  const [user, setuser] = useState({ _id: "" });
  var rerender = useSelector((state) => state.serverDetail.rerender);
  var serverInfo = useSelector((state) => state.serverDetail);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
const [currentUserTyping , setCurrentUserTyping] = useState('');
  useEffect(() => {
    let data = userInfo.newUser;
    setuser(data);
    sendMessageInput.current.value = "";
    try {
      socketOpen(data);
      setSocketConnected(true);
    } catch (error) {
      console.log(error);
      setSocketConnected(false);
    }

    socket.on("typing" , (user)=>{setIsTyping(true);setCurrentUserTyping(user)});
    socket.on("stop typing" , ()=>setIsTyping(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [content, setContent] = useState("");
  const messagesEndRef = useRef();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // const dispatch = useDispatch();
  const messages = useSelector((state) => state.messageDetail.messages);
  const loading = useSelector((state) => state.messageDetail.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    let serverDetail = JSON.parse(serverInfo.newState);
    
    console.log("hi i rendered");
    
    selectedChatCompare = serverDetail;
    socket.emit("join room", serverDetail._id);
    dispatch(fetchMessagesByChatid(serverDetail._id));
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender, serverInfo.newState]);

  useEffect(() => {
      socket.on("message received", (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatid) {
          console.log("message recieved but not in selected chat");
        };
        dispatch(fetchMessagesByChatid(newMessageRecieved.chat._id));
      });
      return () => {
        socket.on("disconnect");
        // console.log("disconnect");
      };

  });

  return (
    <>
      <Box className="hideScrollbar overflow-scroll chat-box-wrapper ">
        {/* <ScrollableFeed className="h-full hideScrollbar"> */}
          {messages.map((message, i) => (
            <React.Fragment key={`chat-box-fragment-${i}`}>
              <Box className="chat-box-spacing">
                <Box className="chat-box">
                  {
                    <BlackTooltip
                      sender
                      placement={"bottom"}
                      arrow
                      title={message?.sender?.name}
                    >
                      <img
                        className="user-pfp"
                        src={message?.sender?.profilepic}
                        alt="pfp"
                      />
                    </BlackTooltip>
                  }
                  {
                    <Box className="chat-box-header">
                      <Box className="chat-box-sender-name">
                        <p>{message?.sender?.name}</p>
                      </Box>
                      <BlackTooltip
                        date
                        placement={"top"}
                        arrow
                        title={dayjs(message?.createdAt).format("LLLL")}
                      >
                        <Box className="chat-box-time">
                          <p>{getDateFormat(message?.createdAt)}</p>
                        </Box>
                      </BlackTooltip>
                    </Box>
                  }
                  {
                    <Box className="chat-box-content">
                      <p> {message?.content}</p>
                    </Box>
                  }
                </Box>
              </Box>
            </React.Fragment>
          ))}
          {loading && (
            <React.Fragment key={`chat-box-fragment-${390234842018458320n}`}>
              <Box className="chat-box-spacing">
                <Box className="chat-box">
                  {
                    <BlackTooltip
                      sender
                      placement={"bottom"}
                      arrow
                      title={user?.name}
                    >
                      <img
                        className="user-pfp"
                        src={user.profilepic}
                        alt="pfp"
                      />
                    </BlackTooltip>
                  }
                  {
                    <Box className="chat-box-header">
                      <Box className="chat-box-sender-name">
                      Wait Please...
                      </Box>
                      <BlackTooltip
                        date
                        placement={"top"}
                        arrow
                        title={dayjs().format("LLLL")}
                      >
                        <Box className="chat-box-time">
                          <p>{getDateFormat(dayjs())}</p>
                        </Box>
                      </BlackTooltip>
                    </Box>
                  }
                  {
                    <Box
                      style={{ color: "#6d6d6e" }}
                      className="chat-box-content"
                    >
                      <Lottie
                style={{ width: "50px" }}
                loop
                autoPlay
                animationData={typingAnimationData}
              />
                      {/* <p>{sendMessageInput.current?.value}</p> */}
                    </Box>
                  }
                </Box>
              </Box>
            </React.Fragment>
          )}
          <div ref={messagesEndRef} />
        {/* </ScrollableFeed> */}
      </Box>

      <SendMessageInput currentUserTyping={currentUserTyping} user={user} setTyping={setTyping} setIsTyping={setIsTyping} typing={typing} isTyping={isTyping} socketConnected={socketConnected} socket={socket} sendMessageInput={sendMessageInput} />
    </>
  );
};

export default LoggedInUserChatingScreen;
