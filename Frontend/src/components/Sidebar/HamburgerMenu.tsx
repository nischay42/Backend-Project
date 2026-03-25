import { X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import {
  playlist,
  collection,
  content,
  support,
  setting
} from '../../assets/index'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const location = useLocation()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const menuItems = [
    // { 
    //   label: "Liked Videos", 
    //   icon: like, 
    //   path: "/liked-videos", 
    //   auth: false 
    // },
    { 
      label: "Playlists", 
      icon: playlist, 
      path: "/playlist", 
      auth: false 
    },
    { 
      label: "Watch Later", 
      icon: collection, 
      path: "/watch-later", 
      auth: false 
    },
    { 
      label: "Profile", 
      icon: content, 
      path: `/@${user?.username}`, 
      auth: true 
    },
    { 
      label: "Support", 
      icon: support, 
      path: "/support", 
      auth: false 
    },
    { 
      label: "Settings", 
      icon: setting, 
      path: "/setting", 
      auth: false 
    },
  ]

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer from Right */}
      <div
        className={`
          lg:hidden fixed top-0 right-0 h-full w-70 bg-black border-l border-gray-800 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && user && (
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{user.fullname}</p>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {menuItems.map((item) => {
              if (item.auth && !isAuthenticated) return null

              const isActive = location.pathname === item.path

              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive ? 'bg-[#AE7AFF] text-white' : 'text-gray-300 hover:bg-gray-800'}
                    `}
                  >
                    <img src={item.icon} alt={item.label} className="w-6 h-6" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-gray-500 text-xs text-center">
            © 2024 Your Platform
          </p>
        </div>
      </div>
    </>
  )
}

export default HamburgerMenu