import { useState, useEffect } from 'react'
import { getWatchLaterVideos } from '../api/playlist.api'
import { useToastContext } from '../context/ToastContext'
import VideoCard from '../components/video/VideoCard'
import VideoCardSkeleton from '../components/video/VideoCardSkeleton'

const WatchLater = () => {
  const [watchLaterVideos, setWatchLaterVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToastContext()


  useEffect(() => {
    const fetchWathLaterVideos = async () => {
      setIsLoading(true)
      try {
        const res = await getWatchLaterVideos()
        setWatchLaterVideos(res.data)
      } catch (error) {
        console.log('Failed to fetch WatchLaterVideos', error);
        toast.error('Failed to fetch WatchLaterVideos')  
      } finally {
        setIsLoading(false)
      }
    }   
    fetchWathLaterVideos()
  }, [])
  
  return (
    <div className="overflow-hidden">
      <div className='text-4xl font-medium m-5'>Watch later</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-w-[80vw] pb-10 px-2 lg:px-5">
        {isLoading
            ? (
                Array.from({ length: 9 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
            ))
            ) :( <>{watchLaterVideos.map((video) => (
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

export default WatchLater