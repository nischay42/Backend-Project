import {  profile } from "../../assets"
import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX } from 'lucide-react';
import { getTimeAgo } from "../../utils/timeAgo";
import { useNavigate } from "react-router-dom";

interface videoProp  {
    fullname: string
    thumbnail: string
    avatar: string
    videoFile: string
    duration: string
    title: string
    views: string
    createdAt: string
    videoId: string
}

const VideoCard = ({
    fullname,
    thumbnail,
    avatar,
    videoFile,
    duration,
    title,
    views,
    createdAt,
    videoId
}: videoProp) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoDuration, setVideoDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [savedTime, setSavedTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
 const navigate = useNavigate()
 
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds /  60)
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
    const video = videoRef.current
    if (!video) return

    const progressBar = e.currentTarget
    const react = progressBar.getBoundingClientRect()
    const clickX = e.clientX - react.left
    const percentage = clickX / react.width
    video.currentTime = percentage * video.duration
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative mt-4 cursor-pointer" onClick={() => navigate(`/watch?v=${videoId}`)}>
      <div 
        className="static  z-0 top-0 h-full w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >        
        <div className={`relative w-full h-56 transition-all duration-500 ease-in-out ${isHovering ? 'scale-105 [box-shadow:2px_0px_45px_-15px_rgba(255,255,255,0.75)]' : ''}`}>
          {!isHovering && (
            <img src={thumbnail} alt="Thumbnail" className={`w-88 h-56 transition-all duration-800 ease-in-out opacity-100 ${isHovering ? 'opacity-0' : ''}`} />
          )}

          {isHovering && (
            <video 
              ref={videoRef}
              src={videoFile} 
              autoPlay
              muted={isMuted}
              loop 
              className={`w-88 h-56 transition-all duration-1000 ease-in-out opacity-0 ${isHovering ? 'opacity-100' : ''}`} 
            />
          )}

          {isHovering && (
            <div className="absolute inset-0 flex flex-col justify-between p-2">
              <div className="flex justify-end">
                <div 
                  onClick={toggleMute}
                  className="bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX />
                  ): (
                    <Volume2 />
                  )}
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
                <div 
                  className="h-4 flex flex-col justify-center"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-1 bg-gray-600/50 rounded-full cursor-pointer"
                  >
                    <div 
                      className="h-full bg-red-600 rounded-full"
                      style={{width: `${progress}%`}}
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isHovering && (
            <div className="absolute text-xs bg-black/80 w-auto right-[0.3rem] bottom-[0.4rem] px-1.5 py-0.5 rounded-sm font-semibold">
              <p>{duration}</p>
            </div>
          )}
        </div>

        <div className="flex w-66 h-30">
          <div className="flex pt-5 mr-2 w-11">
            <img src={profile} srcSet={avatar} className='h-10 w-10 rounded-full'/>
          </div>
          <div className="w-53">
            <div className="font-medium mt-4">
              <p>{title}</p>
            </div>
            <div className=" text-[#5B5B5B] mt-2">
              <p className="capitalize">{fullname}</p>
            </div>
            <div className="flex gap-2 text-sm text-[#5B5B5B] ">
              <p>{views} Views</p>
              <p>•</p>
              <p>{getTimeAgo(createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard