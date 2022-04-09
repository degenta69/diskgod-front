import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import HomeScreen from '../components/HomeScreen/HomeScreen'
import SideBar from '../components/SideBar/SideBar'

const Main = () => {
  const isMobile = useMediaQuery({ maxWidth: 900 })
  const nav = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('userToken')) {
      nav('/auth/login')
    }
  }, [])

  return (
    <div style={{gridTemplateColumns:isMobile?'auto':'5.5% 94.5%',gridTemplateRows:isMobile?'10% 90%':''}} className='grid h-full'> 
    <div  className='bg-sidebarBG overflow-y-hidden hideScrollbar overflow-x-auto py-3 MAXlg:py-0 MAXlg:px-1 MAXlg:flex MAXlg:items-center'>

        <SideBar/>
    </div>
    <div className='bg-serverBG'>

        <HomeScreen/>
    </div>
    </div>
  )
}

export default Main