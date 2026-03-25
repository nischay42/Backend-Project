import { Home, Heart, History, UserRoundCheck, Menu as MenuIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SnackBarProps {
  onMenuClick: () => void
}

const SnackBar = ({ onMenuClick }: SnackBarProps) => {
  const location = useLocation()

  const tabs = [
    { 
      label: "Home", 
      icon: Home, 
      path: "/", 
      auth: false  
    },
    { 
      label: "History", 
      icon: History, 
      path: "/history", 
      auth: false  
    },
    { 
      label: "Liked Videos", 
      icon: Heart, 
      path: "/liked-videos", 
      auth: false  
    },
    { 
      label: "Subscribed", 
      icon: UserRoundCheck, 
      path: "/subscribers", 
      auth: false 
    },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          if (tab.auth === true) return null
          
          const Icon = tab.icon
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#AE7AFF]' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[#AE7AFF]' : ''}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </Link>
          )
        })}

        {/* Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center flex-1 h-full text-gray-400 hover:text-white transition-colors"
        >
          <MenuIcon className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Menu</span>
        </button>
      </div>
    </nav>
  )
}

export default SnackBar