import { useState, useEffect } from 'react'
import { useToastContext } from '../../context/ToastContext'
import VideoCard from '../../components/video/VideoCard'
import { useOutletContext } from 'react-router-dom'
import { getChannelVideo } from '../../api/dashboard.api'
import VideoCardSkeleton from '../../components/video/VideoCardSkeleton'

type ChannelContext = {
  channelId: string
}

const Subscriber = () => {
    const { channelId } = useOutletContext<ChannelContext>()
    const [videos, setVideos] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToastContext()

    useEffect(() => {    
    const fetchVideo = async () => {
      const sortType='desc'
      if (!channelId) return
      setIsLoading(true)
      try {
        const res = await getChannelVideo(channelId, sortType)
        setVideos(res.data)        
      } catch (error) {
        console.error("Failed to fetch channel videos", error)
        toast.error('Failed to fetch videos')
      } finally {
        setIsLoading(false)
        }
    } 
    fetchVideo()
    }, [channelId])

  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-[80vw] px-2 lg:px-5">
        {isLoading
            ? (
              Array.from({ length: 9 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
            ) : (<>{videos && videos.map((video) => (
           <VideoCard
           key={video._id}
           fullname={video.owner.fullname}
           username={video.owner.username}
           thumbnail={video.thumbnail}
           avatar={video.owner.avatar}
           videoFile={video.videoFile}
           title={video.title}
           views={video.views}
           createdAt={video.createdAt}
           duration={video.duration}
           videoId={video._id}
          />
        ))}</>)}
      </div>
    </div>
  )
}

export default Subscriber