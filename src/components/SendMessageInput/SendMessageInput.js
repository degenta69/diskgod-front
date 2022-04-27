import React, { useEffect, useRef, useState } from "react";
// import ServerNavbar from "../ServerNavbar/ServerNavbar";
import { Box } from "@material-ui/core";
import "./SendMessageInput.css";
import SendIcon from "@mui/icons-material/Send";
import instance from "../../axios";
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
}) => {
  const serverInfo = useSelector((state) => state.serverDetail);
  var serverDetail = JSON.parse(serverInfo.newState);

  const [content, setContent] = useState("");
  const [content2, setContent2] = useState("");
  const myFormRef = useRef();
  const dispatch = useDispatch();

  const handleSendMessage = async (e) => {
    setContent(sendMessageInput.current.value);

    e.preventDefault();
    const data = {
      content: content2,
      chatId: serverDetail._id,
    };

    try {
      const sendMessageApiReq = await instance.post("/api/message", data);
      if (sendMessageApiReq.status === 200) {
        socket.emit("new message", sendMessageApiReq.data);
        socket.emit("stop typing", serverDetail._id);
        console.log(sendMessageApiReq.data);

        dispatch(fetchMessagesByChatid(serverDetail._id));
        dispatch(addRerender({}));
        setContent("");
        setContent2("");
        myFormRef.current.reset();
        setRender((prev) => !prev);
      }
      // console.log(sendMessageApiReq, 'sendMessageApiReq');
    } catch (error) {
      // dispatch(addRerender({}))
      // console.log(error.request)
    }
  };
  const [rows, setRows] = useState(1);
  const [render, setRender] = useState(false);

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
  const onEnterPress = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      myFormRef.current.requestSubmit();
    }
  };
  const handleOnchangeAndTyping = (e) => {
    setRender((prev) => !prev);
    setContent2(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { serverDetail: serverDetail._id, user: user });
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timediff = timeNow - lastTypingTime;
      if (timediff >= timerLength && typing) {
        socket.emit("stop typing", serverDetail._id);
        setTyping(false);
      }
    }, timerLength);
  };
  // const typingAnimationConfig = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: typingAnimationData,
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice'

  //   }
  // }
  return (
    <>
      <Box className="sendMessageFormWrapper">
        <form ref={myFormRef} onSubmit={handleSendMessage}>
          <SendIcon onClick={handleSendMessage} className="sendMessageIcon" />
          <textarea
            autoComplete="off"
            onChange={handleOnchangeAndTyping}
            className="chat-textarea hideScrollbar"
            type="text"
            rows={rows}
            ref={sendMessageInput}
            onKeyDown={onEnterPress}
            // onKeyUp={onEnterPress}
            placeholder={`Message ${serverDetail.chatName}`}
          />
          <input type="submit" className="hidden" placeholder="Search" />
        <div>
          {isTyping && (
            <div style={{display:'flex', alignItems:'flex-end'}}>
              {" "}
              <Lottie
                style={{ width: "50px" }}
                loop
                autoPlay
                animationData={typingAnimationData}
              />
              <p style={{color:'#9d9797', fontSize:'14px'}}>
              <span style={{fontWeight:'700'}}>{currentUserTyping.name}</span> is typing...
              </p>
            </div>
          )}
        </div>
        </form>
      </Box>
    </>
  );
};

export default SendMessageInput;
