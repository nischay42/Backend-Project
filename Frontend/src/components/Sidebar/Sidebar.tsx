import {
    collection,
    history,
    home,
    like,
    content,
    setting,
    subscriber,
    support
} from "../../assets/index.ts"
import Button from './Button.tsx'
import { useAppSelector } from "../../app/hooks.ts"
import { Link } from "react-router-dom"
import type { RootState } from "../../app/store.ts"
import { PanelRightClose } from 'lucide-react';
import { useState } from "react"

const Sidebar = () => {

const { isAuthenticated } = useAppSelector((state) => state.auth)
const username  = useAppSelector((state: RootState) => state.auth.user?.username)
const [isSidebarOpen, setIsSidebarOpen] = useState(true)

const sidebarTabs = [
  { label: "Home", icon: home, path: "/", group: "top", isVisible: true },
  { label: "Liked Video", icon: like, path: "/liked-videos", group: "top", isVisible: isAuthenticated },
  { label: "History", icon: history, path: "/history", group: "top", isVisible: isAuthenticated },
  { label: "Profile", icon: content, path: `/@${username}`, group: "top", isVisible: isAuthenticated },
  { label: "Collection", icon: collection, path: "/collection", group: "top", isVisible: isAuthenticated },
  { label: "Subscribers", icon: subscriber, path: "/subscribers", group: "top", isVisible: isAuthenticated },

  { label: "Support", icon: support, path: "/support", group: "bottom" },
  { label: "Setting", icon: setting, path: "/setting", group: "bottom" },
  ]

  const topTabs = sidebarTabs.filter(tab => tab.group === "top")
  const bottomTabs = sidebarTabs.filter(tab => tab.group === "bottom")

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className={`flex flex-col justify-between 
      h-full w-1/6 border-white border-r p-2
      transition-all duration-700 ease-in-out
      ${!isSidebarOpen
        ? 'w-15'
        : 'w-1/6'
      }
      `}
    >
      <ul>
      <div 
        className={`flex flex-col w-full border cursor-pointer items-end pr-1`}
        onClick={handleSidebar}
      >
          <PanelRightClose 
            className={`h-8 w-8 transition-all 
              duration-500 ease-in-out
              ${!isSidebarOpen
              ? 'delay-700'
              : 'delay-700 rotate-180'
              }
              `}
          />
      </div>
        {topTabs.map((item) => 
          (item.isVisible ? 
              <li
              key={item.label}
              >
                <Link to={item.path}>
                    <Button 
                      icon={item.icon}
                      label={item.label}
                      showLabel={isSidebarOpen}
                      className={`
                        `}
                    />
                </Link>
              </li>
           : 
           null)
        )}
      </ul>
      <ul>
        
        {bottomTabs.map((item) => (
          <li
              key={item.label}
            >
              <Link to={item.path}>
                   <Button 
                      icon={item.icon}
                      label={item.label}
                      showLabel={isSidebarOpen}
                      className={`transition-all duration-200 ease-in-out delay-1000`}
                    />
              </Link>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar