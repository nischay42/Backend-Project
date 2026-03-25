import { useState, useRef, useEffect, useCallback } from 'react'
import { profile, followLight, following } from '../../assets';
import { ThumbsUp, ThumbsDown, FolderPlus, Ellipsis, ChevronDown } from 'lucide-react';
import Button from '../Button';
import { getTimeAgo } from '../../utils/timeAgo';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { useToastContext } from '../../context/ToastContext';
import { toggleSubscription, getChannelSubscribers } from '../../api/subscription.api';
import { getVideoLikes, toggoleVideoLike } from '../../api/like.api';
import { createPlaylist, getUserPlaylists, addVideoToPlaylist, isVideoInWatchLater,
    removeVideoFromPlaylist, removeFromWatchLater, addToWatchLater 
} from '../../api/playlist.api';
import Input from '../Input';


type VideoPlayerProp = {
    username: string
    fullname: string
    title: string
    avatar: string
    views: string
    description: string
    createdAt: string
    channelId: string
    videoId: string
}

interface Subscribers {
  isChannelOwner: boolean
  isSubscribed: boolean
  subscribersCount: number
}


const VideoPlayerDetails = ({
    title,
    views,
    createdAt,
    avatar,
    fullname,
    description,
    username,
    channelId,
    videoId
}: VideoPlayerProp) => {
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [reactType, setReactType] = useState('')
    const [likeCount, setLikeCount] = useState(0)
    const [dislikeCount, setDislikeCount] = useState(0)
    const [refreshLikes, setRefreshLikes] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    const [playlistName, setPlaylistName] = useState('')
    const [playlists, setPlaylists] = useState<any[]>([])
    const [isWatchLater, setIsWatchLater] = useState(false)
    const [subscribers, setSubscribers] = useState<Subscribers | null>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const maxLength = 80;
    const textBreak = description.replace(new RegExp(`^(.{${maxLength}}\\S*).*`),'$1...')
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const toast = useToastContext()
    const menuRef = useRef<HTMLDivElement>(null)


// fetch subscribers
  useEffect(() => {
    if (!channelId) return
    const fetchSubscribers = async () => {
      try {        
        const res = await getChannelSubscribers(channelId)
        setSubscribers(res.data)
        setIsFollowing(res.data?.isSubscribed)        
      } catch (error) {
        console.log("Failed to fetch Subscribers count", error);
        toast.error("Failed to fetch Subscribers count")
      }
    }
    fetchSubscribers()
  }, [isFollowing])


// toggle to handle video like
    const handleVideoLike = async (reactionType: string) => {
        if (!isAuthenticated) return toast.warning("Plesae Login/Signup first",);
        try {
            await toggoleVideoLike(videoId, reactionType)
            setReactType(reactionType)
            setRefreshLikes(prev => prev + 1)
        } catch (error) {
            console.log("Failed to toggle video reaction:", error)
            toast.error('Failed to toggle video reaction')
        }
    }


// fetch video likes
  useEffect(() => {
    const fetchVideoLikes = async () => {
        try {
            const res = await getVideoLikes(videoId)            
            setLikeCount(res.data?.likesCount)
            setDislikeCount(res.data?.dislikesCount)
            setReactType(res.data?.userReaction)
        } catch (error) {
            console.log("Failed to fetch video likes:", error)
            toast.error('Failed to fetch video likes')
        }
    }
    fetchVideoLikes()
  }, [refreshLikes, videoId])
  
// handle subscription
    const handleSubscription = async() => {
        if (isAuthenticated) {
            await toggleSubscription(channelId)
            setIsFollowing(!isFollowing)
            if (!isFollowing) toast.success("Channel Subscribed")
            else {
                toast.info("Channel Unsubscribed") 
                setIsFollowing(!isFollowing)
            }
        }
        else toast.warning('Please Login/Signup to Subscribe', 3000)
    }


// handle description
    const handleDescription = () => {
        setIsDescriptionOpen(!isDescriptionOpen)

        if (!isDescriptionOpen && descriptionRef.current) {
            setTimeout(() => {
                descriptionRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 100);
        }
    }

    // menu hide/show
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

    // fetch playlists
    const fetchUserPlaylist = useCallback(async () => {
        try {
            if (!isAuthenticated) return
            const res = await getUserPlaylists(videoId)
            setPlaylists(res.data)
        } catch (error) {
            console.log('Failed to fetch user playlists', error)
            toast.error('Failed to fetch user playlists')
        }
    }, [videoId])

    useEffect(() => {
        fetchUserPlaylist()
    }, [fetchUserPlaylist])
        
    // toggle video in/out of playlist
    const handleTogglePlaylist = async (playlistId: string, isCurrentlyInPlaylist: boolean) => {
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

    // create new playlist
    const handleCreatePlaylist = async () => {
        if (!isAuthenticated) {
            toast.warning('Please login to create playlist')
            setPlaylistName('')
            return
        }
        if (playlistName.trim().length === 0) {
            toast.error('Please enter a playlist name') 
            return
        }

        try {
            await createPlaylist(playlistName)
            toast.success('Playlist created successfully')
            setPlaylistName('')
            await fetchUserPlaylist()
        } catch (error) {
            console.log('Failed to create playlist', error)
            toast.error('Failed to create playlist')
        }
    }
    
    useEffect(() => {
      const fetchWatchLaterStatus = async () => {
        if (!videoId) return
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

    
  return (
    <div className="w-full h-auto p-5 border rounded-lg">
        <div className="w-full flex flex-col lg:flex-row items-start justify-between relative">

            <div className="lg:w-1/2 w-full">
                <div className=" font-normal text-xl">{title}</div>
                <div className="flex gap-2 mt-2 font-normal text-sm">
                    <span>{views} Views</span>
                    <span>•</span>
                    <span>{getTimeAgo(createdAt)}</span>
                </div>
            </div>
            {/* like/dislike, save/unsave, add to playlist */}
            <div className=" flex items-end gap-2 lg:gap-5 mt-2 lg:mt-0 lg:absolute right-0">
                <div className="border select-none w-33 border-white rounded-lg flex justify-between px-3 py-2 text-base ">
                    <div 
                      onClick={() => handleVideoLike('like')}
                      className="flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <ThumbsUp stroke={reactType === 'like' ? '#AE7AFF' : 'white'} />
                        <span>{likeCount}</span>
                    </div>

                    <div 
                      onClick={() => handleVideoLike('dislike')}
                      className="flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <ThumbsDown stroke={reactType === 'dislike' ? '#AE7AFF' : 'white'} />
                        <span className='text-gray-500' >{dislikeCount}</span>
                    </div>
                </div>

                <div 
                    onClick={toggleAddToWatchLater}
                    className="flex items-center cursor-pointer gap-3 px-3 py-2 
                    border bg-white text-base text-gray-700 font-medium rounded-lg
                    transition-all duration-200 ease-in-out active:scale-95 hover:scale-105
                    shadow-lg hover:shadow-xl active:shadow-md select-none"
                >
                    <FolderPlus />
                    <span>{isWatchLater ? "Remove" : "Save"}</span>
                </div>
                {/* menu */}
                <div 
                    ref={menuRef}
                    onClick={handleMenuClick}
                    className="flex relative text-white rounded-full
                    border px-2 py-2 cursor-pointer" 
                >
                    <Ellipsis />
                    {showMenu && (
                    <div 
                        className="absolute right-3 top-11 bg-black border w-60 z-50 rounded-lg p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center">
                            <h1 className='text-lg whitespace-nowrap'>Save to playlist</h1>
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
                                            onChange={() => handleTogglePlaylist(
                                                playlist._id,          
                                                playlist.isVideoInPlaylist 
                                            )}
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
                        <h1 className='mt-3 mb-1'>Name</h1>
                        <div className="flex flex-col items-center gap-4">
                            <Input 
                                className='rounded-lg bg-white' 
                                textColour='text-black'
                                placeholderText='placeholder:text-gray-500' 
                                placeholder='Enter playlist name'
                                onChange={(e) => setPlaylistName(e.target.value)}
                                value={playlistName}
                            />
                            <Button 
                                children='Create new playlist' 
                                className='rounded-lg' 
                                onClick={handleCreatePlaylist}
                            />
                        </div>
                    </div>
                )}
                </div>

            </div>
        </div>

        <div className="w-full flex items-center justify-between mt-5">
            <div className="">
                <div className="flex gap-2 items-center">

                    <Link to={`/@${username}`}>
                        <img src={avatar || profile} className='h-10 w-10 rounded-full object-cover object-center' />
                    </Link>

                    <div className="flex flex-col">
                        <Link to={`/@${username}`}>
                            <span className='font-medium text-base cursor-pointer capitalize'>{fullname}</span>
                        </Link>
                        <span className='font-normal text-sm'>{subscribers?.subscribersCount} Subscribers</span>
                    </div>
                </div>
            </div>
            {!subscribers?.isChannelOwner &&            
              <>
                {!isFollowing
                  ? <Button 
                        icon={followLight} 
                        children='Subscribe'
                        textColor='white' 
                        padding='px-4 py-2.5' 
                        onClick={handleSubscription}
                    />
                  : <Button 
                      icon={following}
                      children='Subscribed' 
                      bgColor='bg-white'
                      padding='px-3 py-2.5' 
                      onClick={handleSubscription}
                  />
                }
              </>
            }
        </div>

        <div className="h-0.5 bg-white mt-5 mr-15" />

        <div ref={descriptionRef} className="mt-5 relative">
           <div className={`
                overflow-hidden  transition-all
                duration-500 ease-out
                ${isDescriptionOpen
                    ? 'max-h-600 opacity-100'
                    : 'max-h-20 opacity-95'
                }
                `}
            >
            <p className='mr-15 transition-all ease-in-out duration-300 whitespace-pre-wrap'>
               {!isDescriptionOpen 
                 ? textBreak
                 : description
               }
            </p>
           </div>
           <div 
          className={`
            absolute bottom-0 left-0 right-15 h-16
            bg-linear-to-t from-black via-black/80 to-transparent
            pointer-events-none
            transition-opacity duration-300
            ${isDescriptionOpen ? 'opacity-0' : 'opacity-100'}
          `}
        />
        
        <button
          onClick={handleDescription}
          className="absolute right-0 top-0 p-2 transition-all cursor-pointer"
        >
          <ChevronDown 
            className={`
              text-gray-400 w-5 h-5
              transition-all duration-300 ease-out
              ${isDescriptionOpen ? 'rotate-180' : 'rotate-0'}
            `} 
          />
        </button>
      </div>
    </div>
  )
}
export default VideoPlayerDetails
