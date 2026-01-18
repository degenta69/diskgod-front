import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import SendMessageInput from '../SendMessageInput/SendMessageInput'
import { Box } from '@material-ui/core'
import './LoggedInUserChatingScreen.css'
import { Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import { tooltipClasses } from '@mui/material/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { getDateFormat } from '../../utils/messageUtils'
import { fetchMessagesByChatid, addNewMessage, addRerender } from '../../state/messageData/messageDataSlice'
import { openProfileModal } from '../../state/profileModal/profileModalSlice'
import MessageStatus from '../MessageStatus/MessageStatus'
import socket from '../../socket/socketioLogic'
import axios from '../../api/axios'

dayjs.extend(LocalizedFormat)

export const BlackTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#1c1d1e',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#1c1d1e',
    color: '#bdbdbd',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}))

const LoggedInUserChatingScreen = () => {
  const sendMessageInput = useRef()
  const messagesEndRef = useRef(null)
  const dispatch = useDispatch()

  const user = useSelector(state => state.userInfo.newUser)
  const serverInfo = useSelector(state => state.serverDetail)
  const messages = useSelector(state => state.messageDetail.messages)


  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentUserTyping, setCurrentUserTyping] = useState('')

  const serverDetail = useMemo(() => JSON.parse(serverInfo.newState), [serverInfo.newState])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleTyping = useCallback((socketUser) => {
    setIsTyping(true)
    setCurrentUserTyping(socketUser)
  }, [])

  const handleStopTyping = useCallback(() => {
    setIsTyping(false)
    setCurrentUserTyping('')
  }, [])



  const handleSendMessage = useCallback(async (messagePayload) => {
    // OPTIMISTIC UPDATE
    dispatch(addNewMessage(messagePayload));
    scrollToBottom();

    try {
      // API CALL
      const { data } = await axios.post("/api/message", {
        content: messagePayload.content,
        chatId: messagePayload.chatId,
      });

      // SOCKET EMIT
      socket.emit("new message", data);

    } catch (error) {
      console.error("Error Sending Message:", error);
    }
  }, [scrollToBottom, dispatch])

  useEffect(() => {
    socket.emit('setup', user)
    socket.on('connected', () => setSocketConnected(true))

    return () => {
      socket.off('connected')
    }
  }, [user])

  useEffect(() => {
    if (socketConnected) {
      socket.on('typing', handleTyping)
      socket.on('stop typing', handleStopTyping)
    }

    return () => {
      socket.off('typing')
      socket.off('stop typing')
    }
  }, [socketConnected, handleTyping, handleStopTyping])

  useEffect(() => {
    if (serverDetail && serverDetail._id) {
      socket.emit('join room', serverDetail._id) // 1. Join the room first
      dispatch(fetchMessagesByChatid(serverDetail._id)) // 2. Then fetch messages
      dispatch(addRerender())

      // Feature: Mark Chat as Read
      const currentUserId = user._id || user.id;
      if (serverDetail._id && currentUserId) {
        socket.emit("mark chat read", { chatId: serverDetail._id, userId: currentUserId });
      }
    }
  }, [serverDetail, dispatch, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <>
      <Box className='hideScrollbar overflow-scroll chat-box-wrapper'>
        {messages.map((message, i) => (
          <React.Fragment key={`chat-box-fragment-${i}`}>
            <Box className='chat-box-spacing'>
              <Box className='chat-box'>
                <BlackTooltip placement={'bottom'} title={message?.sender?.name || "Unknown User"}>
                  <img
                    className='user-pfp'
                    src={message?.sender?.profilepic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                    alt='pfp'
                    style={{ cursor: 'pointer' }}
                    onClick={() => dispatch(openProfileModal(message.sender))}
                  />
                </BlackTooltip>
                <Box className='chat-box-header'>
                  <Box className='chat-box-sender-name'>
                    <p>{message?.sender?.name || "Unknown"}</p>
                  </Box>
                  <BlackTooltip placement={'top'} title={message?.createdAt ? dayjs(message?.createdAt).format('LLLL') : "Unknown Date"}>
                    <Box style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: "10px", marginTop: "auto", marginLeft: "4px" }}>
                        {getDateFormat(message.createdAt)}
                      </span>
                      <MessageStatus message={message} chat={serverDetail} currentUser={user} />
                    </Box>
                  </BlackTooltip>
                </Box>
                <Box className='chat-box-content'>
                  <p>{message?.content}</p>
                </Box>
              </Box>
            </Box>
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <SendMessageInput
        user={user}
        serverDetail={serverDetail}
        setTyping={setTyping}
        setIsTyping={setIsTyping}
        typing={typing}
        isTyping={isTyping}
        currentUserTyping={currentUserTyping}
        socketConnected={socketConnected}
        socket={socket}
        sendMessageInput={sendMessageInput}
        onSendMessage={handleSendMessage}
      />
    </>
  )
}

export default LoggedInUserChatingScreen