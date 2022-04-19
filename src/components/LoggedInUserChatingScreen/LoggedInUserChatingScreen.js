import React, { useEffect, useRef, useState } from "react";
import SendMessageInput from "../SendMessageInput/SendMessageInput";
import { Box } from "@material-ui/core";
import "./LoggedInUserChatingScreen.css";
import { Avatar, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import instance from "../../axios";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { textTransform } from "@mui/system";
import ScrollableFeed from "react-scrollable-feed";
import {
  getDateFormat,
  isLastMessage,
  isSameSender,
} from "../../utils/messageUtils";
import io from "socket.io-client";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";
// import {  } from "../../state/messageData/messageDataSlice";
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
const ENDPOINT = "https://diskgod.herokuapp.com/"
var socket, selectedChatCompare;

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
  useEffect(() => {
    let data = JSON.parse(userInfo.newUser);
    setuser(data);
  }, []);
  var rerender = useSelector((state) => state.serverDetail.rerender);
  var serverInfo = useSelector((state) => state.serverDetail);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
const [currentUserTyping , setCurrentUserTyping] = useState('');
  useEffect(() => {
    let user = JSON.parse(userInfo.newUser);
    socket = io.connect(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      console.log(user);
      console.log("connected to server");
      setSocketConnected(true);
    });
    socket.on("typing" , (user)=>{setIsTyping(true);setCurrentUserTyping(user)});
    socket.on("stop typing" , ()=>setIsTyping(false))
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
    scrollToBottom();
    
    console.log("hi i rendered");
    dispatch(fetchMessagesByChatid(serverDetail._id));

    selectedChatCompare = serverDetail;
    socket.emit("join room", serverDetail._id);
  }, [rerender, serverInfo.newState]);

  useEffect(() => {
      socket.on("message received", (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chatid) {
          console.log("message recieved but not in selected chat");
        };
        dispatch(fetchMessagesByChatid(newMessageRecieved.chat._id));
      });
  });

  return (
    <>
      <Box className="hideScrollbar chat-box-wrapper ">
        <ScrollableFeed className="hideScrollbar">
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
            <React.Fragment key={`chat-box-fragment-${390234842018458320}`}>
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
                        <p>{user.name}</p>
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
                      <p>{sendMessageInput.current.value}</p>
                    </Box>
                  }
                </Box>
              </Box>
            </React.Fragment>
          )}
          <div ref={messagesEndRef} />
        </ScrollableFeed>
      </Box>

      <SendMessageInput currentUserTyping={currentUserTyping} user={user} setTyping={setTyping} setIsTyping={setIsTyping} typing={typing} isTyping={isTyping} socketConnected={socketConnected} socket={socket} sendMessageInput={sendMessageInput} />
    </>
  );
};

export default LoggedInUserChatingScreen;
