import React from 'react'
import ChatScreen from '../ChatScreen/ChatScreen'
// import ServerDetails from '../ServerDetails/ServerDetails'
import SwipeableTemporaryDrawer from '../ServerDetails/SwipeDrawerWrapper'

const HomeScreen = () => {
  return (
    <div style={{gridTemplateColumns:'0% 100%'}} className='grid grid-cols-2 h-screen'> 
    <div  className='bg-serverBG '>
      <SwipeableTemporaryDrawer/>
    </div>
    <div className='bg-mainBG overflow-y-hidden h-screen '>
<ChatScreen/>
    </div>
    </div>
  )
}

export default HomeScreen