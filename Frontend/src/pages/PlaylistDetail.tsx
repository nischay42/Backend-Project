import { useState, useEffect, useRef } from 'react'
import { getPlaylist, updatePlaylist } from '../api/playlist.api'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import Button from '../components/Button'
import { Share2, Pencil } from 'lucide-react'
import { profile } from '../assets'
import WatchVideoCard from '../components/video/WatchVideoCard'
import Input from '../components/Input'
import { useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'

interface Owner {
  avatar: string
  fullname: string
  username: string
  _id: string
  isUser: boolean
}

type PlaylistPayload = {
  createdAt: string
  isPrivate: boolean
  name: string
  owner: Owner
  videos: any[]
  description: string
  _id: string
}

const PlaylistDetail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const playlistId = searchParams.get('p')
  const playlistQuery = playlistId ? `&p=${playlistId}` : ''
  const [firstVideoThumbnail, setFirstVideoThumbnail] = useState<string | undefined>(undefined)
  const [playlist, setPlaylist] = useState<PlaylistPayload | null>(null)
  const [privacyStatus, setPrivacyStatus] = useState<boolean>(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [showUpdatesCard, setShowUpdatesCard] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const username  = useAppSelector((state: RootState) => state.auth.user?.username)
  
  const modalRef = useRef<HTMLDivElement>(null)
  const toast = useToastContext()

  const MAX_TITLE_LENGTH = 100
  const MAX_DESCRIPTION_LENGTH = 500

  // Initialize form values when playlist loads
  useEffect(() => {
    if (playlist) {
      setPrivacyStatus(playlist.isPrivate)
      setNewPlaylistName(playlist.name)
      setNewDescription(playlist.description || '')
    }
  }, [playlist])

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowUpdatesCard(false)
      }
    }

    if (showUpdatesCard) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUpdatesCard])


  // Validate and update playlist
  const handlePlaylistUpdate = async () => {
    if (!playlistId || !playlist) return

    // Validation
    if (!newPlaylistName || !newPlaylistName.trim()) {
      toast.error('Playlist title is required')
      return
    }

    if (newPlaylistName.trim().length > MAX_TITLE_LENGTH) {
      toast.error(`Title cannot exceed ${MAX_TITLE_LENGTH} characters`)
      return
    }

    if (newDescription.length > MAX_DESCRIPTION_LENGTH) {
      toast.error(`Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`)
      return
    }

    setIsUpdating(true)

    const updatePayload = {
      name: newPlaylistName.trim(),
      description: newDescription.trim(),
      isPrivate: privacyStatus
    }

    try {
      const res = await updatePlaylist(playlistId, updatePayload)
      
      setPlaylist(prev => {
        if (!res?.data) return prev
        if (!prev) return res.data
        return {
          ...prev,
          name: res.data.name,
          description: res.data.description,
          isPrivate: res.data.isPrivate
        }
      })
      
      setShowUpdatesCard(false)
      toast.success('Playlist updated successfully')
    } catch (error: any) {
      console.error('Failed to update Playlist: ', error)
      toast.error(error?.response?.data?.message || 'Failed to update playlist')
    } finally {
      setIsUpdating(false)
    }
  }

  // Fetch playlist details
  useEffect(() => {
    if (!playlistId) return
    
    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylist(playlistId)
        setPlaylist(res.data)        
        setFirstVideoThumbnail(res.data?.videos[0]?.thumbnail)        
      } catch (error) {
        toast.error('Failed to fetch playlist')
        console.error('Failed to fetch Playlist: ', error)
      }
    }
    
    fetchPlaylist()
  }, [playlistId])

  // Handle Play All
  const handlePlayAll = () => {
    if (!playlist || !playlist.videos || playlist.videos.length === 0) {
      toast.warning('This playlist is empty')
      return
    }

    const firstVideo = playlist.videos[0]
    navigate(`/watch?v=${firstVideo._id}${playlistQuery}`)
  }

  // Handle video click
  const handleVideoClick = (videoId: string) => {
    navigate(`/watch?v=${videoId}${playlistQuery}`)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)

      toast.success('Link copied successfully')
      // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-5 w-full h-full relative">
      {/* Playlist details left side */}
      <div className="lg:p-5 lg:border h-auto lg:h-full lg:w-1/3 rounded-lg">
        <div className="flex justify-center items-center">
          <img 
            src={firstVideoThumbnail} 
            className='h-40 w-full object-cover rounded-lg' 
            alt={playlist?.name}
          />
        </div>
        
        <h1 className='text-3xl font-semibold my-3 lg:my-5'>{playlist?.name}</h1>
        
        <div className="text-sm flex items-center gap-3 mb-1 cursor-pointer">
          <img 
            src={playlist?.owner?.avatar || profile} 
            className='h-10 w-10 rounded-full object-cover object-center' 
            alt={playlist?.owner?.fullname}
          />
          <h1 className='flex items-center gap-1'>
            by <span className='capitalize'>{playlist?.owner?.fullname}</span>
          </h1>
        </div>
        
        <div className="flex gap-1 text-sm">
          <p>Playlist</p>
          <p>•</p>
          <p>{playlist?.isPrivate ? 'Private' : 'Public'}</p>
          <p>•</p>
          <p>
            {playlist?.videos?.length} {playlist?.videos && playlist.videos.length !== 1 ? 'videos' : 'video'}
          </p>
        </div>
        
        <div className="flex items-center gap-3 my-2 lg:my-3 lg:mt-5">
          <Button 
            onClick={handlePlayAll}
            className='rounded-full'
          >
            Play all
          </Button>
           {playlist?.owner?.isUser && <div
              onClick={() => setShowUpdatesCard(true)}
              className="
                flex items-center justify-center transition-all duration-200 ease-in-out
                active:scale-90 hover:scale-110 shadow-lg hover:shadow-xl active:shadow-md
                h-10 w-10 rounded-full bg-[#ffffff86] cursor-pointer
              "
            >
              <Pencil />
            </div>}
            <div
              onClick={handleShare}
              className="
                flex items-center justify-center transition-all duration-200 ease-in-out
                active:scale-90 hover:scale-110 shadow-lg hover:shadow-xl active:shadow-md
                h-10 w-10 rounded-full bg-[#ffffff86] cursor-pointer
              "
            >
              <Share2 />
            </div>
        </div>
        
        <div className="overflow-y-auto h-20 lg:h-32 text-sm text-gray-300">
          {playlist?.description && playlist.description.length > 0
            ? playlist.description
            : 'This playlist has no description'}
        </div>
      </div>

      {/* Playlist videos right side */}
      <div className="flex flex-col mt-5 lg:w-2/3 gap-2 lg:pr-4 lg:overflow-y-auto lg:max-h-screen pb-30 lg:pb-5">
        {playlist?.videos && playlist.videos.length > 0 ? (
          playlist.videos.map((video) => (
            <div 
              key={video._id}
              onClick={() => handleVideoClick(video._id)}
            >
              <WatchVideoCard
                fullname={video.owner.fullname}
                username={video.owner.username}
                thumbnail={video.thumbnail}
                videoFile={video.videoFile}
                avatar={video.owner.avatar}
                duration={video.duration}
                title={video.title}
                views={video.views}
                createdAt={video.createdAt}
                videoId={video._id}
                isPlaylistViewCard={true}
                playlistId={playlist?._id}
                isUserPlaylist={(playlist?.owner.username) === username}
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400">
            This playlist is empty
          </div>
        )}
      </div>

      {/* Update playlist modal with backdrop */}
      {showUpdatesCard && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/70 z-40" />
          
          {/* Modal */}
          <div 
            ref={modalRef}
            className="fixed w-[90vw] lg:w-125 rounded-lg border border-gray-700 p-6 flex flex-col gap-5 bg-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="">
              <h1 className='text-xl font-semibold'>Update Playlist</h1>
            </div>

            {/* Title Input */}
            <div>
              <Input
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className='rounded-lg'
                label='Title'
                placeholder='Enter playlist title'
                maxLength={MAX_TITLE_LENGTH}
              />
              <div className={`text-xs mt-1 ${newPlaylistName.length > MAX_TITLE_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                {newPlaylistName.length}/{MAX_TITLE_LENGTH}
              </div>
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className='w-full rounded-lg text-white p-3 border outline-none focus:border-[#AE7AFF] bg-transparent resize-none'
                placeholder='Add a description (optional)'
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
              />
              <div className={`text-xs mt-1 ${newDescription.length > MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                {newDescription.length}/{MAX_DESCRIPTION_LENGTH}
              </div>
            </div>

            {/* Privacy Select */}
            <div>
              <label className="block text-sm mb-2">Privacy</label>
              <select
                value={privacyStatus ? 'Private' : 'Public'}
                onChange={(e) => setPrivacyStatus(e.target.value === 'Private')}
                className="w-full rounded-lg text-white p-3 border outline-none focus:border-[#AE7AFF] focus:ring-0 bg-transparent"
              >
                <option value="Public" className="bg-black">Public</option>
                <option value="Private" className="bg-black">Private</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-2">
              <Button
                onClick={() => setShowUpdatesCard(false)}
                className='rounded-lg flex-1 border border-gray-600 bg-transparent hover:bg-gray-800'
                textColor='white'
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePlaylistUpdate}
                className='rounded-lg flex-1'
                disabled={isUpdating || !newPlaylistName.trim() || newPlaylistName.length > MAX_TITLE_LENGTH || newDescription.length > MAX_DESCRIPTION_LENGTH}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PlaylistDetail