import { LogOutIcon, Tv, Dock } from 'lucide-react'
import { profile } from '../../assets'
import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import { EllipsisVertical } from 'lucide-react'

interface UserMenuProps {
  avatar: string | undefined
  fullname: string | undefined
  username: String | undefined
  onLogout: () => void
}

const UserMenu = ({
  avatar,
  fullname,
  username,
  onLogout
}: UserMenuProps) => {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const [showCard, setShowCard] = useState(false)

  const handleLogout = () => {
    onLogout()
  }

  const navigateProfile = () => {
    navigate(`/@${username}`)
  }

  const navigateDashboard = () => {
    navigate('/dashboard')
  }

  useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowCard(false)
          }
        }
        if (showCard) {
          document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
  }, [showCard])
  
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowCard(!showCard)
  }


  return (
    
    <div className="" ref={menuRef}>
      <div 
        className="p-2 hover:bg-neutral-800 cursor-pointer text rounded transition-colors"
        onClick={handleMenuClick} 
      >
        <EllipsisVertical
          className="p-1"
        />
      </div>
        
      {showCard && (
        <div className='relative'>
          <div className="absolute w-60 border z-50 right-[1vw] top-1 bg-black rounded-md">
            <div className="flex border-b">
              <div className="p-4">
                <img src={avatar || profile} className='h-10 w-10 rounded-full object-cover object-center'/>
              </div>
              <div className="py-4">
                <p className='capitalize'>{fullname}</p>
                <p>@{username}</p>
              </div>
            </div>
            <div className="p-3 flex flex-col gap-2 select-none">
                <button 
                  className="flex gap-4 cursor-pointer transition-all 
                  duration-75 active:text-[#AE7AFF]"
                  onClick={() => {
                    navigateProfile()
                    setShowCard(false)
                  }}
                  >
                  <Tv />
                  <span>View your channel</span>
                </button>
                <button 
                  className="flex gap-4 cursor-pointer transition-all 
                  duration-75 active:text-[#AE7AFF]"
                  onClick={() => {
                    navigateDashboard()
                    setShowCard(false)
                  }}
                  >
                  <Dock />
                  <span>View Dashboard</span>
                </button>
                <button 
                  className="flex gap-4 cursor-pointer transition-all 
                  duration-75 active:text-[#AE7AFF]"
                  onClick={() => {
                    handleLogout()
                    setShowCard(false)
                  }}
                  >
                  <LogOutIcon />
                  <span>Log out</span>
                </button>
            </div>
          </div> 
        </div>
      )}
    </div>
  )
}

export default UserMenu
