import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import CreateGroupWizard from '../components/CreateGroupWizard/CreateGroupWizard'
import ServerSettingsModal from '../components/ServerSettingsModal/ServerSettingsModal'
import UserProfileModal from '../components/UserProfileModal/UserProfileModal'
import HomeScreen from '../components/HomeScreen/HomeScreen'
import SideBar from '../components/SideBar/SideBar'
import "../App.css"
import useSocketEvents from '../hooks/useSocketEvents'

const Main = () => {
  useSocketEvents();
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
      <CreateGroupWizard />
      <ServerSettingsModal />
      <UserProfileModal />

      {/* Mobile/Tablet: Vertical layout with top bar */}
      {isMobile ? (
        <div className='flex flex-col h-screen w-screen overflow-hidden bg-sidebarBG'>
          {/* Top Bar - Server Listings */}
          <div className='shrink-0 w-full overflow-x-auto hideScrollbar px-3 py-2 
                        flex flex-row items-center gap-2 bg-sidebarBG/50 backdrop-blur-xl border-b border-white/5'>
            <SideBar horizontal />
          </div>

          {/* Main Content Area */}
          <div className='flex-1 h-full relative overflow-hidden bg-serverBG/90 backdrop-blur-md'>
            <HomeScreen />
          </div>
        </div>
      ) : (
        /* Desktop: Horizontal layout with sidebar */
        <div className='flex h-screen w-screen overflow-hidden bg-sidebarBG'>
          {/* Sidebar */}
          <div className='shrink-0 h-full overflow-y-auto hideScrollbar py-3 transition-all duration-300
                        w-[72px] flex flex-col items-center bg-sidebarBG/50 backdrop-blur-xl border-r border-white/5'>
            <SideBar />
          </div>

          {/* Main Content Area */}
          <div className='flex-1 h-full relative overflow-hidden bg-serverBG/90 backdrop-blur-md'>
            <HomeScreen />
          </div>
        </div>
      )}
    </>
  )
}

export default Main