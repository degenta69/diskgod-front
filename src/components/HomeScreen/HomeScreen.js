import React from 'react'
import ChatScreen from '../ChatScreen/ChatScreen'
import ServerNavbar from '../ServerNavbar/ServerNavbar';

const HomeScreen = () => {
  return (
    <div style={{ gridTemplateColumns: '0% 100%' }} className='grid grid-cols-2 h-screen'>
      <div className='bg-serverBG '>
        <ServerNavbar isHome={true} />
      </div>
      <div className='bg-mainBG overflow-y-hidden h-screen '>
        <ChatScreen />
      </div>
    </div>
  )
}

export default HomeScreen