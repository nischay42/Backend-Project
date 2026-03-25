import { useState, useEffect } from 'react'
import { getSubscribedChannels } from '../../api/subscription.api'
import { useToastContext } from '../../context/ToastContext'
import { profile } from '../../assets'
import { useNavigate } from 'react-router-dom'
import VideoCard from '../../components/video/VideoCard'
import VideoCardSkeleton from '../../components/video/VideoCardSkeleton'

interface subscriberDetails {
  fullname: string
  subscriberId: string
  username: string
  avatar: string
  _id: string
  videos: any[]
}

const AllSubscribers = () => {
  const [subscribers, setSubscribers] = useState<subscriberDetails[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToastContext()
  const navigate = useNavigate()

  useEffect(() => {
   const fetchSubscribers = async () => {
     setIsLoading(true)
     try {
      const res = await getSubscribedChannels()
      setSubscribers(res.data?.subscriber)
      
    } catch (error: any) {
      console.log('Failed to fetch subscribers', error);
      toast.error('Failed to fetch subscribers')
    } finally {
        setIsLoading(false)
      }
   }
   fetchSubscribers()
  }, [])

return (
  <div className="mt-6 overflow-hidden">

    {/* Skeleton while loading */}
    {isLoading ? (
      Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          {/* Channel header skeleton */}
          <div className="flex gap-3 items-center p-1">
            <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="h-3 w-28 rounded bg-gray-700 animate-pulse" />
              <div className="h-3 w-20 rounded bg-gray-700 animate-pulse" />
            </div>
          </div>
          {/* Video cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-w-[80vw] p-1">
            {Array.from({ length: 3 }).map((_, j) => (
              <VideoCardSkeleton key={j} />
            ))}
          </div>
        </div>
      ))
    ) : (
      subscribers?.map((subscriber) => (
        <div key={subscriber._id}>
          <div className="flex gap-3 items-center p-1">
            <img
              src={subscriber.avatar || profile}
              className="h-10 w-10 rounded-full object-cover object-center"
              onError={(e) => { e.currentTarget.src = profile }}
              onClick={() => navigate(`/@${subscriber.username}`)}
            />
            <div onClick={() => navigate(`/@${subscriber.username}`)}>
              <h1 className="font-semibold capitalize">{subscriber.fullname}</h1>
              <h2>@{subscriber.username}</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-w-[80vw] p-1">
            {subscriber?.videos.map((video) => (
              <VideoCard
                key={video._id}
                fullname={subscriber.fullname}
                username={subscriber.username}
                thumbnail={video.thumbnail}
                avatar={subscriber.avatar}
                videoFile={video.videoFile}
                title={video.title}
                views={video.views}
                createdAt={video.createdAt}
                duration={video.duration}
                videoId={video._id}
              />
            ))}
          </div>
        </div>
      ))
    )}

  </div>
)
}

export default AllSubscribers