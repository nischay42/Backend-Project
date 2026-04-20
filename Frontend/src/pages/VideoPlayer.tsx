import { useState, useEffect, useRef } from 'react'
import VideoPlayerCard from '../components/video/VideoPlayerCard'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import VideoPlayerDetails from '../components/video/VideoPlayerDetails'
import Input from '../components/Input'
import Button from '../components/Button'
import TweetCard from '../components/channel/TweetCard'
import WatchVideoCard from '../components/video/WatchVideoCard'
import { getAllVideo, addVideoView, getVideoById } from '../api/video.api'
import { addComment, getVideoComments } from '../api/comment.api'
import { useAppSelector } from '../app/hooks'
import { getPlaylist } from '../api/playlist.api'
import WatchVideoCardSkeleton from '../components/video/WatchVideoCardSkeleton'
import VideoPlayerCardSkeleton from '../components/video/VideoPlayerCardSkeleton'

interface VideoPayload {
  owner: {
    avatar: string
    fullname: string
    username:  string
    _id: string
  }
  views: string
  videoFile: string
  thumbnail: string
  title: string
  description: string
  createdAt: string
  duration: string
  _id: string
}

interface Comment {
  _id: string
  content: string
  owner: {
    fullname: string
    avatar?: string
  }
  createdAt: string
  isVideoOwner: boolean
}

const VideoPlayer = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [video, setVideo] = useState<VideoPayload | null>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [playlist, setPlaylist] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [fetchComments, setFetchComments] = useState<any[]>([])
  const [totalComments, setTotalComments] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const viewCountedRef = useRef(false)
   
  const videoId = searchParams.get('v')
  const playlistId = searchParams.get('p')
  const toast = useToastContext()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const page = 1
  const limit = 10

  useEffect(() => {
    if (!playlistId) {
      setPlaylist(null)
      return
    }

    const fetchPlaylist = async () => {
      try {
        const res = await getPlaylist(playlistId)
        setPlaylist(res.data)
      } catch (error) {
        console.error('Failed to fetch playlist', error)
        setPlaylist(null)
      }
    }

    fetchPlaylist()
  }, [playlistId])

  // fetch video for video player
  useEffect(() => {
    if (!videoId) return
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(videoId)
        setVideo(res.data)
      } catch (error) {
        toast.error('Failed to fetch video')
        console.log('Failed to fetch Video: ', error);        
      }
    }  
    fetchVideo()    
  }, [videoId])

  // fetch videos for video suggestion
  useEffect(() => {
    const fetchVideos = async () => {
      const limit = 12
      setIsLoading(true)
      try {
        const res = await getAllVideo(limit, 'All', 1, true)
        setVideos(res.data.videos)
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch videos")
      } finally {
        setIsLoading(false)
      }
    }
    fetchVideos()
  }, [])

  // fetch video comments 
  useEffect(() => {
    if (!videoId) return
    const fetchComments = async () => {
      try {
        const res = await getVideoComments(videoId, page, limit)
        const comments = res?.data?.comments ?? []        
        const sortedComments: Comment[] = comments.sort((a: Comment, b: Comment) => {
          if (a.isVideoOwner && !b.isVideoOwner) return -1
          if (!a.isVideoOwner && b.isVideoOwner) return 1
          return 0
        })
        setFetchComments(sortedComments)
        setTotalComments(res?.data?.totalComments)
      } catch (error) {
        console.log('Failed to fetch comments: ', error);
        toast.error('Failed to fetch comments')
      }
    }
    fetchComments()
  }, [videoId, comment])

  useEffect(() => {
    if (!videoId) return
    
    // Reset view counted when video changes
    viewCountedRef.current = false
    
    const timer = setTimeout(async () => {
      if (viewCountedRef.current) return // Already counted
      
      try {
        const watchDuration = 5
        await addVideoView(videoId, watchDuration)
        viewCountedRef.current = true
      } catch (error) {
        console.error('Failed to count view:', error)
      }
    }, 5000) 

    return () => clearTimeout(timer)
  }, [videoId])
  
  // Handle playlist video click - keep playlist context
  const handlePlaylistVideoClick = (video: any) => {
    navigate(`/watch?v=${video._id}${playlistId ? `&p=${playlistId}` : ''}`)
  }

  // Handle suggestion video click - remove playlist context
  const handleSuggestionVideoClick = (videoId: string) => {
    navigate(`/watch?v=${videoId}`)
  }

  // Auto-play next video in playlist
  const handleVideoEnd = () => {
    if (!playlist) return
    
    const currentIndex = playlist.videos.findIndex((v: any) => v._id === videoId)
    if (currentIndex === -1 || currentIndex >= playlist.videos.length - 1) return
    
    const nextVideo = playlist.videos[currentIndex + 1]
    navigate(`/watch?v=${nextVideo._id}${playlistId ? `&p=${playlistId}` : ''}`)
  }

  // handle comment submit
  const handleSubmit = async () => {
    if (!isAuthenticated) return toast.warning('Please Login/Signup to Comment', 3000)
    if (!comment || !videoId) {
      toast.error("Please write something in Tweet")
      return
    }
    try {
      await addComment(videoId,comment);
      setComment(''); 
      toast.success('Tweet created successfully!');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create tweet');
    }
  }
  
  return (
    <div className="lg:flex w-full">
      {/* main content left side */}
      <div className="lg:p-5 px-2 lg:w-4/6 w-full flex flex-col gap-5">
        {!video?.videoFile 
          ? <VideoPlayerCardSkeleton /> 
          :  video && (
            <VideoPlayerCard 
            videoFile={video.videoFile} 
            title={video.title}
            thumbnail={video.thumbnail}
            onVideoEnd={handleVideoEnd}
            />)
        }
        <div className="">
          {video && (
             <VideoPlayerDetails
             fullname={video.owner.fullname}
             username={video.owner.username}
             avatar={video.owner.avatar}
             title={video.title}
             views={video.views}
             createdAt={video.createdAt}
             description={video.description}
             channelId={video.owner._id}
             videoId={video._id}
            />
          )}
        </div>

        {/* comments section */}
        <div className="w-full border rounded-lg p-5 overflow-scroll h-[40vh] lg:h-auto lg:overflow-hidden">
          <div className="">{totalComments} Comments</div>

          <div className="flex flex-col w-full mt-4">
            <Input 
              value={comment}
              onChange={(e) => setComment(e.target.value)} 
              className='rounded-lg placeholder:text-white py-2' 
              placeholder='Add a Comment' 
            />
            <Button 
              onClick={handleSubmit} 
              children='Comment' 
              textColor='white' 
              className='self-end mt-4' 
              padding='px-4 py-2.5' 
            />
          </div>
          <div className="z-10`0">
          {fetchComments && 
            fetchComments.map((comment) => (
              <TweetCard 
                key={comment._id}
                fullname={comment.owner.fullname}
                username={comment.owner.username}
                content={comment.content}
                createdAt={comment.createdAt}
                avatar={comment.owner?.avatar}
                tweetId={comment._id}
              />
            ))
          }
          </div>
        </div>
      </div>          

      {/* Right Sidebar - Playlist + Suggestions */}
      <div className="flex flex-col lg:mt-5 gap-2 lg:pr-4 lg:w-2/6 h-auto overflow-y-auto">
        {/* Playlist Section (if exists) */}
        {playlist && (
          <div className="bg-gray-900 rounded-lg p-4 mb-4 sticky top-0 z-10">
            <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
            {playlist.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{playlist.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
              <span>{playlist.owner?.fullname}</span>
              <span>{playlist.videos.length} videos</span>
            </div>

            {/* Playlist Videos - Scrollable Container */}
            <div className="h-[50vh] overflow-y-auto space-y-2 pr-2">
              {playlist.videos.map((video: any, index: number) => {
                const isActive = video._id === videoId

                return (
                  <div
                    key={video._id}
                    onClick={() => handlePlaylistVideoClick(video)}
                    className={`
                      flex gap-2 p-2 rounded cursor-pointer transition-colors
                      ${isActive ? 'bg-purple-600/20 border-l-2 border-purple-600' : 'hover:bg-gray-800'}
                    `}
                  >
                    <span className={`text-sm shrink-0 w-6 ${isActive ? 'text-purple-400' : 'text-gray-400'}`}>
                      {index + 1}
                    </span>

                    <div className="relative shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-14 object-cover rounded"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/80 px-1 text-xs rounded">
                        {video.duration}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium line-clamp-2 mb-1 ${isActive ? 'text-purple-400' : ''}`}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-400">{video.owner.fullname}</p>
                      <p className="text-xs text-gray-500">{video.views} views</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Suggestions Section */}
        {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2 mb-5 animate-pulse p-5">
                <WatchVideoCardSkeleton key={i} videoWidth="w-1/2" />
              </div>
            ))
          ) : videos.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              There is no videos
            </div>
          ) :(
            <div className="space-y-2 mb-5 px-2 lg-px-0">
              {!playlist && (
                <h3 className="text-lg font-semibold mb-2 px-2">Suggestions</h3>
              )}
              {videos.map((video) => (
                <div key={video._id} onClick={() => handleSuggestionVideoClick(video._id)}>
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
                    videoWidth='lg:w-[17vw] w-full'
                    detailWidth='lg:w-[15vw] w-full'
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export default VideoPlayer