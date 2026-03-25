import { useAppSelector } from "../../app/hooks.ts"
import { Link, useLocation } from "react-router-dom"
import type { RootState } from "../../app/store.ts"
import { PanelRightClose } from 'lucide-react';
import { useState, useEffect } from "react"
import { Home, ThumbsUpIcon as Like, History, Video, ListVideo as Playlist, FolderClosed, UserRoundCheck, CircleQuestionMark as Support, Settings } from "lucide-react"

const Sidebar = () => {

const { isAuthenticated } = useAppSelector((state) => state.auth)
const username  = useAppSelector((state: RootState) => state.auth.user?.username)
const location = useLocation() // ✅ Use this to check active route
const [isVisible, setIsVisible] = useState(true)

const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
  const saved = localStorage.getItem('sidebarOpen')
  return saved !== null ? JSON.parse(saved) : true
})

useEffect(() => {
  localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen))
}, [isSidebarOpen])

useEffect(() => {
  if (location.pathname === '/watch') setIsSidebarOpen(false)
  if (location.pathname === '/') setIsSidebarOpen(true)
  if (location.pathname === '/dashboard') setIsSidebarOpen(false)
  if (location.pathname === '/setting') setIsVisible(false)
  if (location.pathname !== '/setting') setIsVisible(true)
  if (location.pathname === '/setting/password') setIsVisible(false)
}, [location.pathname])

const sidebarTabs = [
  { label: "Home", icon: Home, path: "/", group: "top", auth: false },
  { label: "Liked Video", icon: Like, path: "/liked-videos", group: "top", auth: false },
  { label: "History", icon: History, path: "/history", group: "top", auth: false },
  { label: "Profile", icon: Video, path: `/@${username}`, group: "top", auth: !isAuthenticated },
  { label: "Playlist", icon: Playlist, path: "/playlist", group: "top", auth: false },
  { label: "Watch later", icon: FolderClosed, path: "/watch-later", group: "top", isVisible: false },
  { label: "Subscribed", icon: UserRoundCheck, path: "/subscribers", group: "top", auth: false },
  { label: "Support", icon: Support, path: "/support", group: "bottom", auth: false },
  { label: "Setting", icon: Settings, path: "/setting", group: "bottom", auth: false },
]

  const topTabs = sidebarTabs.filter(tab => tab.group === "top")
  const bottomTabs = sidebarTabs.filter(tab => tab.group === "bottom")

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (!isVisible) return null

  return (
    <div className={`
      hidden lg:flex flex-col justify-between 
      h-full w-1/6 border-white border-r p-2
      transition-all duration-700 ease-in-out
      ${!isSidebarOpen ? 'w-15' : 'w-1/6'}
      `}
    >
      <ul>
        <div 
          className="flex flex-col w-full border cursor-pointer items-end pr-1"
          onClick={handleSidebar}
        >
          <PanelRightClose 
            className={`h-8 w-8 transition-all duration-500 ease-in-out ${
              !isSidebarOpen ? 'delay-700' : 'delay-700 rotate-180'
            }`}
          />
        </div>
        
        {topTabs.map((tab) => {
          if (tab.auth === true) return null
          const Icon = tab.icon
          const isActive = 
            location.pathname === tab.path || 
            location.pathname.startsWith(tab.path + '/');

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2.5 border border-white w-full my-1 p-1 cursor-pointer`}
            >
              <div className="w-6 h-6">
                <Icon className={`ml-1 w-6 h-6 ${isActive ? 'stroke-[#AE7AFF]' : ''}`} />
              </div>
              {isSidebarOpen &&
                <span className={`font-medium whitespace-nowrap transition-colors overflow-visible ${isActive ? 'text-[#AE7AFF]' : 'text-white'}`}>{tab.label}</span>
              }
            </Link>
          )
        }
      )}
      </ul>
      
      <ul>
        {bottomTabs.map((tab) => {
          if (tab.auth === true) return null
          const Icon = tab.icon
          const isActive = location.pathname === tab.path

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex items-center gap-2.5 border border-white w-full my-1 p-1 cursor-pointer`}
            >
              <div className="w-6 h-6">
                <Icon className={`ml-1 w-6 h-6 ${isActive ? 'stroke-[#AE7AFF]' : ''}`} />
              </div>
              {isSidebarOpen &&
                <span className={`font-medium whitespace-nowrap transition-colors overflow-visible ${isActive ? 'text-[#AE7AFF]' : 'text-white'}`}>{tab.label}</span>
              }
            </Link>
            )
          }
        )}
      </ul>
    </div>
  )
}

export default Sidebar