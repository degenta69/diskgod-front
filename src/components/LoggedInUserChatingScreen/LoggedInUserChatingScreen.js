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
import { fetchMessagesByChatid } from '../../state/messageData/messageDataSlice'
import socket from '../../socket/socketioLogic'
import Lottie from 'lottie-react'

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
  
  const [localMessageList, setLocalMessageList] = useState([])
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentUserTyping, setCurrentUserTyping] = useState('')
  const [loading, setLoading] = useState(false)

  const serverDetail = useMemo(() => JSON.parse(serverInfo.newState), [serverInfo.newState])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleTyping = useCallback((socketUser) => {
    console.log('typing started by',socketUser)
    setIsTyping(true)
    setCurrentUserTyping(socketUser)
  }, [])

  const handleStopTyping = useCallback(() => {
    console.log('stopped typing')
    setIsTyping(false)
    setCurrentUserTyping('')
  }, [])

  const handleNewMessage = useCallback((newMessageReceived) => {
    if (serverDetail && serverDetail._id === newMessageReceived.chat._id) {
      setLocalMessageList(prev => [...prev, newMessageReceived])
      scrollToBottom()
    }
  }, [serverDetail, scrollToBottom])

  const handleSendMessage = useCallback((message) => {
    setLocalMessageList(prev => [...prev, message])
    scrollToBottom()
  }, [scrollToBottom])

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
      socket.on('message received', handleNewMessage)
    }

    return () => {
      socket.off('typing')
      socket.off('stop typing')
      socket.off('message received')
    }
  }, [socketConnected, handleTyping, handleStopTyping, handleNewMessage])

  useEffect(() => {
    if (serverDetail && serverDetail._id) {
      socket.emit('join room', serverDetail._id)
      dispatch(fetchMessagesByChatid(serverDetail._id))
    }
  }, [serverDetail, dispatch])

  useEffect(() => {
    setLocalMessageList(messages)
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <>
      <Box className='hideScrollbar overflow-scroll chat-box-wrapper'>
        {localMessageList.map((message, i) => (
          <React.Fragment key={`chat-box-fragment-${i}`}>
            <Box className='chat-box-spacing'>
              <Box className='chat-box'>
                <BlackTooltip placement={'bottom'} title={message?.sender?.name}>
                  <img className='user-pfp' src={message?.sender?.profilepic} alt='pfp' />
                </BlackTooltip>
                <Box className='chat-box-header'>
                  <Box className='chat-box-sender-name'>
                    <p>{message?.sender?.name}</p>
                  </Box>
                  <BlackTooltip placement={'top'} title={dayjs(message?.createdAt).format('LLLL')}>
                    <Box className='chat-box-time'>
                      <p>{getDateFormat(message?.createdAt)}</p>
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
        setLoading={setLoading}
        onSendMessage={handleSendMessage}
      />
    </>
  )
}

export default LoggedInUserChatingScreen