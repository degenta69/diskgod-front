import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ChatScreen from '../ChatScreen/ChatScreen'
// import ServerDetails from '../ServerDetails/ServerDetails'
import SwipeableTemporaryDrawer from '../ServerDetails/SwipeDrawerWrapper'

const HomeScreen = () => {
  const isMobile = useMediaQuery({ maxWidth: 900 })
  return (
    <div style={{gridTemplateColumns:'0% 100%'}} className='grid grid-cols-2 h-screen'> 
    <div  className='bg-serverBG '>
      <SwipeableTemporaryDrawer/>
    </div>
    <div className='bg-mainBG h-screen '>
<ChatScreen/>
    </div>
    </div>
  )
}

export default HomeScreen