import React, { useEffect, useState, useCallback, useRef } from "react";
import { Box } from "@material-ui/core";
import "./SendMessageInput.css";
import SendIcon from "@mui/icons-material/Send";
import Lottie from "lottie-react";
import typingAnimationData from '../../animations/typing.json'

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const SendMessageInput = ({
  user,
  serverDetail,
  setTyping,
  setIsTyping,
  socketConnected,
  socket,
  typing,
  isTyping,
  currentUserTyping,
  sendMessageInput,
  setLoading,
  onSendMessage
}) => {
  const [rows, setRows] = useState(1);
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (content.trim() === "" || isSending) return;

    const newMessage = {
      content,
      chatId: serverDetail._id,
      userId: user.id,
      sender: { _id: user.id, name: user.name },
      createdAt: new Date(),
    };

    setIsSending(true);
    setLoading(true);

    try {
      socket.emit("new message", newMessage);
      socket.emit("stop typing", serverDetail._id);
      setTyping(false);
      setIsTyping(false);
      // onSendMessage(newMessage); // Add the message to the local list immediately
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setContent("");
      sendMessageInput.current.value = "";
      setIsSending(false);
      setLoading(false);
    }
  }, [content, isSending, serverDetail._id, user, setLoading, sendMessageInput, socket, setTyping, setIsTyping]);

  const debouncedTyping = useCallback(()=>
    debounce(() => {
      socket.emit("stop typing", serverDetail._id);
      setTyping(false);
    }, 3000),
    [socket, serverDetail._id, setTyping]
  );

  const handleTyping = useCallback(() => {
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { serverDetail: serverDetail._id, user: user.name });
    }
    debouncedTyping();
  }, [socketConnected, typing, serverDetail._id, user.name, socket, setTyping, debouncedTyping]);

  useEffect(() => {
    if (content) {
      handleTyping();
    } else {
      setTyping(false);
      socket.emit("stop typing", serverDetail._id);
    }
  }, [content, handleTyping, setTyping, socket, serverDetail._id]);

  useEffect(() => {
    if (rows <= 11) {
      let countLines = sendMessageInput.current.value.match(/^/gm).length;
      sendMessageInput.current.rows = countLines;
      setRows(countLines);
    }
    if (rows > 11) {
      setRows(20);
    }
    if (!sendMessageInput.current.value || content.length === 0) {
      setRows(1);
    }
  }, [content, rows, sendMessageInput]);

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
              <span style={{ fontWeight: "700" }}>{currentUserTyping}</span> is typing...
            </p>
          </div>
        )}
      </form>
    </Box>
  );
};

export default SendMessageInput;