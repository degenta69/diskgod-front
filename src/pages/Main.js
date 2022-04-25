import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import AddGroupChatModal from '../components/AddGroupChatModal/AddGroupChatModal'
import HomeScreen from '../components/HomeScreen/HomeScreen'
import SideBar from '../components/SideBar/SideBar'

const Main = () => {
  const isMobile = useMediaQuery({ maxWidth: 900 })
  const nav = useNavigate()
  
  useEffect(() => {
    if (!localStorage.getItem('diskGodUserToken')) {
      nav('/auth/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
    <AddGroupChatModal/>
    <div style={{gridTemplateColumns:isMobile?'auto':'5.5% 94.5%',gridTemplateRows:isMobile?'10% 90%':''}} className='grid h-screen'> 
    <div  className='bg-sidebarBG hideScrollbar overflow-x-auto py-3 MAXlg:py-0 MAXlg:px-1 MAXlg:flex MAXlg:items-center'>

        <SideBar/>
    </div>
    <div className='bg-serverBG h-screen'>

        <HomeScreen/>
    </div>
    </div>
    </>
  )
}

export default Main