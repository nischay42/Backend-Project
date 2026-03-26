import { useState, useEffect, useRef } from "react"
import { EllipsisVertical } from 'lucide-react';
import {
  addVideoToPlaylist,
  addToWatchLater,
  getUserPlaylists,
  isVideoInWatchLater,
  removeFromWatchLater,
  removeVideoFromPlaylist
} from "../../api/playlist.api";
import { useToastContext } from "../../context/ToastContext";
import { useAppSelector } from "../../app/hooks";

type MenuCardProp = {
    videoId: string
    isPlaylistViewCard?: boolean
    playlistId?: string
    isUserPlaylist?: boolean
}

const VideoCardMenu = ({
    videoId,
    isPlaylistViewCard=false,
    playlistId,
    isUserPlaylist
}: MenuCardProp) => {

  const menuRef = useRef<HTMLDivElement>(null)
  const playlistRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [showPlalists, setShowPlalists] = useState(false)
  const [playlists, setPlaylists] = useState<any[]>([])
  const [isWatchLater, setIsWatchLater] = useState(false)
  const toast = useToastContext()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isSaved, setIsSaved] = useState<boolean>(true)

  useEffect(() => {
    const fetchUserPlaylist = async () => {
        if (!videoId) return
        if (!isAuthenticated) return
        try {
            const res = await getUserPlaylists(videoId)
            setPlaylists(res.data)
        } catch (error) {
            console.log('Failed to fetch user playlists', error)
            toast.error('Failed to fetch user playlists')
        }
    }
    fetchUserPlaylist()
  }, [videoId])

  useEffect(() => {
    const fetchWatchLaterStatus = async () => {
      if (!videoId) return
      if (!isAuthenticated) return
      try {
        const res = await isVideoInWatchLater(videoId)
        setIsWatchLater(Boolean(res?.data?.isInWatchLater))
      } catch (error) {
        console.log('Failed to fetch watch later status', error)
      }
    }

    fetchWatchLaterStatus()
  }, [videoId])

  
  const toggleAddToWatchLater = async () => {
    if (!videoId) return
    if (!isAuthenticated) return
    try {
        if (isWatchLater) {
          await removeFromWatchLater(videoId)
          setIsWatchLater(false)
          toast.success('Removed from watch later')
        } else {
          await addToWatchLater(videoId)
          setIsWatchLater(true)
          toast.success('Added to watch later')
        }
    } catch (error) {
        console.log('Failed to add video to playlist', error);
        toast.error('Failed to update watch later')
    }
  }

      // toggle video in/out of playlist
  const handleTogglePlaylist = async (playlistId: string, isCurrentlyInPlaylist: boolean) => {

      if (!isAuthenticated) return
      try {
          if (isCurrentlyInPlaylist) {
              // Remove from playlist                
              await removeVideoFromPlaylist(playlistId, videoId)
              toast.success('Removed from playlist')
          } else {
              // Add to playlist
              await addVideoToPlaylist(playlistId, videoId)
              toast.success('Added to playlist')
          }
          
          // update local state immediately
          setPlaylists(prev => prev.map(playlist => 
              playlist._id === playlistId 
                  ? { 
                      ...playlist, 
                      isVideoInPlaylist: !isCurrentlyInPlaylist,
                      videosCount: isCurrentlyInPlaylist 
                          ? playlist.videosCount - 1 
                          : playlist.videosCount + 1
                    }
                  : playlist
          ))
      } catch (error: any) {
          console.error('Failed to update playlist', error)
          toast.error(error?.response?.data?.message || 'Failed to update playlist')
      }
  }

  const toggleRemoveVideoFromPlaylist = async () => {
    if (!isAuthenticated) return
    if (!playlistId) return
    if (!videoId) return    
     try {
      if (isSaved) {        
        await removeVideoFromPlaylist(playlistId, videoId)
        toast.success('Video Removed from playlist')
        setIsSaved(false)
      } else {        
        await addVideoToPlaylist(playlistId, videoId)
        toast.success('Added to playlist')
        setIsSaved(true)
      }
     } catch (error) {
          console.error('Failed to remove video from playlist', error)
          toast.error('Failed to remove video from playlist')
     }
  }

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false)
            setShowPlalists(false)
        }
        if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
            setShowPlalists(false)
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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowMenu(!showMenu)
  }

  const handleShare = async () => {
    try {
      const fullUrl = `${window.location.origin}/watch?v=${videoId}`
      await navigator.clipboard.writeText(fullUrl)

      toast.success('Link copied successfully')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    }
  }

  return (
    (!showPlalists
        ?
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
               
                {/* visible on home feed */}
                {!isPlaylistViewCard && isAuthenticated &&
                  <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    toggleAddToWatchLater()
                  }}
                >
                  {isWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
                </button>
                }
                {/* visible on home feed */}
                {!isPlaylistViewCard && isAuthenticated &&
                <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPlalists(true)
                  }}
                >
                  Add to Playlist
                </button>
                }
                {/* visible on view playlist */}
                
                {isUserPlaylist && <>
                {isPlaylistViewCard && isAuthenticated &&
                <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu(false)
                    toggleRemoveVideoFromPlaylist()
                  }}
                >
                  {!isSaved ? "Add video to Playlist" : "Remove video from Playlist"}
                </button>
                }
                </>}
                {/* visible everywhere */}
                <button 
                  className="w-full text-left px-4 py-3 hover:bg-neutral-900 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                    setShowMenu(false)
                  }}
                >
                  Share
                </button>
              </div>
            )}
          </div>

        :
        // card to add video in playlist
        <div 
            ref={playlistRef}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col absolute right-2 top-5 z-20 border p-3 rounded-lg bg-black" 
        >
            <h1 className=' whitespace-nowrap'>Save to playlist</h1>
            <div className="flex flex-col items-start">
            {playlists.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                    No playlists yet
                </p>
            ) : (
                playlists.map((playlist) => (
                    <label 
                        key={playlist._id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                        <input 
                            type='checkbox' 
                            checked={playlist.isVideoInPlaylist}
                            onChange={() => {
                                handleTogglePlaylist(
                                    playlist._id,          
                                    playlist.isVideoInPlaylist
                                ),
                                setShowPlalists(false)
                                setShowMenu(false)
                            }}
                            className='h-4 w-4 accent-[#AE7AFF] cursor-pointer' 
                        />
                        <div className="flex-1">
                            <p className="text-sm font-medium">{playlist.name}</p>
                        </div>
                    </label>
                ))
            )}
            </div>
        </div>
    )
  )
}

export default VideoCardMenu
