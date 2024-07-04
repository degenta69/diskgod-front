import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@material-ui/core";
import "./SendMessageInput.css";
import SendIcon from "@mui/icons-material/Send";
import instance from "../../api/axios";
import { addRerender } from "../../state/serverDetailData/serverDetailSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesByChatid } from "../../state/messageData/messageDataSlice";
import Lottie from "lottie-react";
import typingAnimationData from "../../animations/typing.json";

const SendMessageInput = ({
  currentUserTyping,
  user,
  isTyping,
  typing,
  setIsTyping,
  setTyping,
  socket,
  sendMessageInput,
  socketConnected,
  setLoading
}) => {
  const serverInfo = useSelector((state) => state.serverDetail);
  const userInfo = useSelector((state) => state.userInfo);
  const serverDetail = JSON.parse(serverInfo.newState);
  const [rows, setRows] = useState(1);
  const [render, setRender] = useState(false);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (content.trim() === "" || isSending) return;

    const data = {
      content,
      chatId: serverDetail._id,
      userId:userInfo.newUser.id
    };
console.log(data)
    setIsSending(true);
    setLoading(true);
    setContent("");
    sendMessageInput.current.value = "";

    try {
      // const sendMessageApiReq = await instance.post("/api/message", data);
      // if (sendMessageApiReq.status === 200) {
        socket.emit("new message", data);
        socket.emit("stop typing", serverDetail._id);

        dispatch(fetchMessagesByChatid(serverDetail._id));
        dispatch(addRerender({}));

        setIsSending(false);
        setLoading(false);
      // }
    } catch (error) {
      console.error(error);
      setIsSending(false);
      setLoading(false);
    }
  }, [content, isSending, serverDetail._id, setLoading, sendMessageInput, socket, dispatch]);
  useEffect(() => {
    if (rows <= 11) {
      let countLines = sendMessageInput.current.value.match(/^/gm).length;
      sendMessageInput.current.rows = countLines;
      setRows(countLines);
      // console.log(countLines);
    }
    if (rows > 11) {
      setRows(20);
    }
    if (!sendMessageInput.current.value) {
      // console.log('why')
      setRows(1);
    }
    if (content.length === 0) {
      setRows(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render]);
  useEffect(() => {
    if (!socketConnected) return;

    const handleTyping = () => {
      setRender((prev) => !prev);
      if (!isTyping) {
        setTyping(true);
        socket.emit("typing", { serverDetail: serverDetail._id, user: user });
      }
      let lastTypingTime = new Date().getTime();
      let timerLength = 3000;
      setTimeout(() => {
        let timeNow = new Date().getTime();
      let timediff = timeNow - lastTypingTime;
      if(timediff >= timerLength && typing){
        console.log('stoped')

        socket.emit("stop typing", serverDetail._id);
        setTyping(false);
      }
      }, timerLength);

      // return () => clearTimeout(timer);
    };

    handleTyping();
  }, [content]);

  const onEnterPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <Box className="sendMessageFormWrapper">
      <form onSubmit={handleSendMessage}>
        <SendIcon onClick={handleSendMessage} className="sendMessageIcon" />
        <textarea
          ref={sendMessageInput}
          autoComplete="off"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="chat-textarea hideScrollbar"
          type="text"
          rows={rows}
          onKeyDown={onEnterPress}
          placeholder={`Message ${serverDetail.chatName}`}
          disabled={isSending}
        />
        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <Lottie
              style={{ width: "50px" }}
              loop
              autoPlay
              animationData={typingAnimationData}
            />
            <p style={{ color: "#9d9797", fontSize: "14px" }}>
              <span style={{ fontWeight: "700" }}>{currentUserTyping.name}</span> is typing...
            </p>
          </div>
        )}
      </form>
    </Box>
  );
};

export default SendMessageInput;
