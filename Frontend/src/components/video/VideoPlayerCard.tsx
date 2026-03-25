import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoJSPlayerProps {
  videoFile: string
  thumbnail?: string
  title?: string
  onVideoEnd?: () => void
  autoplay?: boolean
}

const VideoPlayerCard = ({ 
  videoFile, 
  thumbnail,
  title,
  onVideoEnd,
  autoplay = false
}: VideoJSPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    if (!videoRef.current) return

    const videoElement = document.createElement('video')
    videoElement.className = 'video-js vjs-big-play-centered'
    videoElement.playsInline = true

    // explicitly set poster attribute for mobile
    if (thumbnail) {
      videoElement.setAttribute('poster', thumbnail)
    }
    
    videoRef.current.appendChild(videoElement)

    const player = videojs(videoElement, {
      controls: true,
      autoplay: autoplay,
      preload: 'none',
      poster: thumbnail,
      title: title,
      fluid: true,
      responsive: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'playbackRateMenuButton',
          'fullscreenToggle',
        ],
      },
      sources: [{
        src: videoFile,
        type: 'video/mp4'
      }]
    })

    playerRef.current = player

    // rotate to landscape on fullscreen, back on exit
    player.on('fullscreenchange', () => {
      const orientation = screen.orientation as any
      if (player.isFullscreen()) {
        orientation?.lock('landscape').catch(() => {})
      } else {
        orientation?.unlock()
      }
    })

    player.on('ended', () => {
      if (onVideoEnd) onVideoEnd()
    })

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [videoFile, thumbnail, autoplay, onVideoEnd])

  return (
    <div className="w-full rounded-lg overflow-hidden bg-black">
      <div ref={videoRef} />
    </div>
  )
}

export default VideoPlayerCard