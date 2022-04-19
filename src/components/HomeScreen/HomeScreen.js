import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ChatScreen from '../ChatScreen/ChatScreen'
import ServerDetails from '../ServerDetails/ServerDetails'

const HomeScreen = () => {
  const isMobile = useMediaQuery({ maxWidth: 900 })
  return (
    <div style={{gridTemplateColumns:isMobile?'35% 65%':'25% 75%'}} className='grid grid-cols-2 h-full'> 
    <div  className='bg-serverBG '>
      <ServerDetails/>
    </div>
    <div className='bg-mainBG overflow-hidden'>
<ChatScreen/>
    </div>
    </div>
  )
}

export default HomeScreen