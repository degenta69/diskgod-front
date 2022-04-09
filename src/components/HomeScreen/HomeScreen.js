import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ServerDetails from '../ServerDetails/ServerDetails'

const HomeScreen = () => {
  const isMobile = useMediaQuery({ maxWidth: 900 })
  return (
    <div style={{gridTemplateColumns:isMobile?'35% 65%':'20% 80%'}} className='grid grid-cols-2 h-full'> 
    <div  className='bg-serverBG '>
      <ServerDetails/>
    </div>
    <div className='bg-mainBG'>

    </div>
    </div>
  )
}

export default HomeScreen