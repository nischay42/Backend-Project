import { profile } from "../../assets"
import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from 'lucide-react';
import { getTimeAgo } from "../../utils/timeAgo";
import { useNavigate } from "react-router-dom";
import VideoCardMenu from "./VideoCardMenu";

interface videoProp {
    fullname: string
    thumbnail: string
    avatar: string
    videoFile: string
    duration: string
    title: string
    views: string
    createdAt: string
    videoId: string
    username?: string
    isPlaylistViewCard?: boolean
}

const VideoCard = ({
    fullname,
    username,
    thumbnail,
    avatar,
    videoFile,
    duration,
    title,
    views,
    createdAt,
    videoId,
    isPlaylistViewCard=false
}: videoProp) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true)
  const [videoDuration, setVideoDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [savedTime, setSavedTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(0)
 
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }  

  const handleMouseLeave = () => {
    if (videoRef.current) {
      setSavedTime(videoRef.current.currentTime)
    }
    setIsHovering(false)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }
 
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
  
    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
      if (savedTime > 0) {
        video.currentTime = savedTime
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [isHovering, savedTime])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      setCurrentTime(video.currentTime)
      setProgress((video.currentTime / video.duration) * 100)
    }

    video.addEventListener('timeupdate', updateProgress)
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress)
    }
  }, [isHovering])



  

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() 
    
    const video = videoRef.current
    if (!video) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    video.currentTime = percentage * video.duration
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleCardClick = () => {
    // window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/watch?v=${videoId}`)
  }

  return (
    <div className="min-w-88 h-88 relative mt-4">
      <div 
        className="static z-0 top-0 h-full w-full cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
      >        
        <div className={`flex relative min-w-88 max-w-100 h-56 overflow-hidden transition-all duration-500 ease-in-out ${isHovering ? 'scale-105 [box-shadow:2px_0px_45px_-15px_rgba(255,255,255,0.75)]' : ''}`}>
          {!isHovering && (
            <img 
              src={thumbnail} 
              alt="Thumbnail" 
              className={`w-full h-56 object-cover transition-all duration-800 ease-in-out opacity-100 ${isHovering ? 'opacity-0' : ''}`} 
            />
          )}

          {isHovering && (
            <video 
              ref={videoRef}
              src={videoFile} 
              autoPlay
              muted={isMuted}
              preload="metadata"
              loop  
              className={`min-w-88 max-w-100 h-56 object-cover transition-all duration-1000 ease-in-out opacity-0 ${isHovering ? 'opacity-100' : ''}`} 
            />
          )}

          {isHovering && (
            <div className="absolute inset-0 flex flex-col justify-between p-2 z-10">
              <div className="flex justify-end">
                <div 
                  onClick={toggleMute}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-white font-semibold px-1">
                  <span className="bg-black/60 px-1.5 py-0.5 rounded">
                    {formatTime(currentTime)}
                  </span>
                  <span className="bg-black/60 px-1.5 py-0.5 rounded">
                    {formatTime(videoDuration)}
                  </span>
                </div>
                {/*  Progress bar  */}
                <div 
                  className="h-4 flex flex-col justify-center cursor-pointer"
                  onClick={handleSeek} 
                >
                  <div className="h-1 bg-gray-600/50 rounded-full">
                    <div 
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isHovering && (
            <div className="absolute text-xs bg-black/80 right-2 bottom-2 px-1.5 py-0.5 rounded font-semibold">
              <p>{duration}</p>
            </div>
          )}
        </div>

        <div className="relative w-full">
          {/* Menu */}
          <VideoCardMenu 
            videoId={videoId}
            isPlaylistViewCard={isPlaylistViewCard}
          />
            {/* Card details */}
          <div className="flex min-w-88 max-w-100 h-32">
            <div className="flex pt-5 mr-2 min-w-11 max-w-30">
              <img 
                onClick={(e) => {
                  e.stopPropagation()
                  if(username) navigate(`/@${username}`)
                }} 
                src={avatar || profile} 
                alt={fullname}
                className='h-10 w-10 rounded-full object-cover object-center'
              />
            </div>
            <div className="min-w-53 max-w-70">
              <div className="font-medium mt-4">
                <p className="line-clamp-2">{title}</p>
              </div>
              <div className="text-gray-400 mt-2"
                onClick={(e) => {
                  e.stopPropagation()
                  if(username) navigate(`/@${username}`)
                }} 
              >
                <p className="capitalize text-sm">{fullname}</p>
              </div>
              <div className="flex gap-2 text-sm text-gray-400">
                <p>{views} Views</p>
                <p>•</p>
                <p>{getTimeAgo(createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VideoCard
