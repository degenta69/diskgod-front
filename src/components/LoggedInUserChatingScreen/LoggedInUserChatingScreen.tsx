import React, { useEffect, useRef, useState } from "react";
import SendMessageInput from "../SendMessageInput/SendMessageInput";
import { Box } from "@material-ui/core";
import "./LoggedInUserChatingScreen.css";
import { Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { getDateFormat } from "../../utils/messageUtils";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";
import socket, { socketOpen } from "../../socket/socketioLogic";
import Lottie from "lottie-react";
import typingAnimationData from "../../animations/typing.json";
import { RootState } from '../../state/store'; // Assuming you have a central store file
import { Message, User } from '../../types'; // Define your types in a types file

dayjs.extend(LocalizedFormat);

export const BlackTooltip = styled(({ className, ...props }: any) => (
  <Tooltip
    {...props}
    sx={{
      right: {
        sm: "0",
        lg: "-10px",
      },
      bottom: "-10rem",
    }}
    className="font-bold"
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
    fontWeight: "bold",
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

var selectedChatCompare: any;

const LoggedInUserChatingScreen: React.FC = () => {
  const sendMessageInput = useRef<HTMLInputElement>(null);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [user, setUser] = useState<User>({ _id: "", name: "", profilepic: "" });
  const serverInfo = useSelector((state: RootState) => state.serverDetail);  
  var rerender = useSelector((state: RootState) => state.serverDetail.rerender);
  const [localMessageList, setLocalMessageList] = useState<Message[]>([]);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUserTyping, setCurrentUserTyping] = useState<User>({ _id: "", name: "", profilepic: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let data = userInfo.newUser;
    setUser(data);
    if (sendMessageInput.current) sendMessageInput.current.value = "";
    try {
      socketOpen(data);
      setSocketConnected(true);
      console.log('yaay');
    } catch (error) {
      console.log(error);
      setSocketConnected(false);
    }

    socket.on("typing", (user: User) => { 
      console.log('typing started', user._id, data._id);
      setIsTyping(true);
      setCurrentUserTyping(user);
    });

    socket.on("stop typing", () => setIsTyping(false));
    
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const messages = useSelector((state: RootState) => state.messageDetail.messages);
  const dispatch = useDispatch();

  useEffect(() => {
    const serverDetail = JSON.parse(serverInfo.currentChat) as { _id: string };
    selectedChatCompare = serverDetail;
    socket.emit("join room", serverDetail._id);
    (async() => {
      await dispatch(fetchMessagesByChatid(serverDetail._id));
      scrollToBottom();
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender, serverInfo.currentChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived: Message) => {
      console.log('fired in socket');
      const serverDetail = JSON.parse(serverInfo.currentChat) as { _id: string };
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        console.log("Message received but not in selected chat");
      } else {
        console.log({ selectedChatCompare, newMessageReceived });
        (async() => {
          await dispatch(fetchMessagesByChatid(serverDetail._id));
        })();
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }
    });

    return () => {
      socket.off("message received");
      socket.on("disconnect");
    };
  }, [serverInfo.currentChat, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <Box className="hideScrollbar overflow-scroll chat-box-wrapper">
        {messages.map((message, i) => (
          <React.Fragment key={`chat-box-fragment-${i}`}>
            <Box className="chat-box-spacing">
              <Box className="chat-box">
                <BlackTooltip
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
                <Box className="chat-box-content">
                  <p>{message?.content}</p>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        ))}
        {loading && (
          <React.Fragment key={`chat-box-fragment-${390234842018458320n}`}>
            <Box className="chat-box-spacing">
              <Box className="chat-box">
                <BlackTooltip
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
                  <p>{sendMessageInput.current?.value}</p>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        )}
        <div ref={messagesEndRef} />
      </Box>
      <SendMessageInput 
        currentUserTyping={currentUserTyping} 
        user={user} 
        setTyping={setTyping} 
        setIsTyping={setIsTyping} 
        typing={typing} 
        isTyping={isTyping} 
        socketConnected={socketConnected} 
        socket={socket} 
        sendMessageInput={sendMessageInput} 
        setLoading={setLoading}
      />
    </>
  );
};

export default LoggedInUserChatingScreen;