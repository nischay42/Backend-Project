import { useState, useEffect, useRef } from "react"
import { EllipsisVertical } from 'lucide-react';
import {
  savePlaylist,
  removeFromSavedPlaylist,
  checkPlaylistSaved,
  deletePlaylist,
  removeVideoFromPlaylist
} from "../../api/playlist.api";
import { useToastContext } from "../../context/ToastContext";
import { useAppSelector } from "../../app/hooks";

type MenuCardProp = {
    playlistId: string
    isUserPlaylist?: boolean
}

const VideoCardMenu = ({
    playlistId,
    isUserPlaylist,
}: MenuCardProp) => {

  const menuRef = useRef<HTMLDivElement>(null)
  const playlistRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState(false)
  const toast = useToastContext()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [copied, setCopied] = useState(false)
  const [isSaved, setIsSaved] = useState<boolean>()
  
  // Save playlist
  const toggleSavePlaylist = async () => {
    if (!playlistId) return
    if (!isAuthenticated) return
    try {
        if (isSaved) {
          console.log('remove');
          await removeFromSavedPlaylist(playlistId)
          toast.success('Removed from watch later')
          
        } else {
          console.log('add');
          await savePlaylist(playlistId)
          toast.success('Added to watch later')
        }
    } catch (error) {
        console.log('Failed to add video to playlist', error);
        toast.error('Failed to update watch later')
    }
  }

  // check is playlist saved 
  useEffect(() => {
    const checkIsPlaylistSaved = async () => {
        if (!playlistId) return
        if (!isAuthenticated) return
        try {
            const res = await checkPlaylistSaved(playlistId)
            setIsSaved(res.data?.isSaved)
        } catch (error) {
            console.log('Failed to fetch user playlists', error)
            toast.error('Failed to fetch user playlists')
        }
    }
    checkIsPlaylistSaved()
  }, [playlistId, toggleSavePlaylist])

const handleDeletePlaylist = async () => {
  if (!playlistId) return
  if (!isAuthenticated) return
  try {
    await deletePlaylist(playlistId)
    toast.success('Playlist deleted successfully')
  } catch (error) {
    console.log('Failed to delete playlist', error);
    toast.error('Failed to delete playlist')
  }
}

  // hide menu card onclick outside
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false)
        }
        if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
            setShowMenu(false)
        }
      }
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside)
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
  }, [showMenu])

  // stop menu close onclick on card buttons 
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

    const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Link copied successfully')
      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
          <div className="absolute right-2 top-5 z-20" ref={menuRef}>
            <div 
              className="p-2 hover:bg-neutral-800 cursor-pointer text rounded transition-colors"
              onClick={handleMenuClick} 
            >
              <EllipsisVertical
                className="p-1"
              />
            </div>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-black border rounded-lg shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} 
              >
                {!isUserPlaylist && isAuthenticated &&
                  <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    toggleSavePlaylist()
                    e.stopPropagation()
                    setShowMenu(false)
                  }}
                >
                  {isSaved ? "Unsave Playlist" : "Save Playlist"}
                </button>
                }
                {isUserPlaylist && isAuthenticated && 
                <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePlaylist()
                    setShowMenu(false)
                  }}
                >
                  Delete Playlist
                </button>
                }
              </div>
            )}
          </div>
  )
}

export default VideoCardMenu
