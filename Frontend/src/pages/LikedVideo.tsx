import { useState, useEffect } from 'react'
import { getLikedVideos } from '../api/like.api'
import { useToastContext } from '../context/ToastContext'
import WatchVideoCard from '../components/video/WatchVideoCard'
import { Search } from 'lucide-react'
import WatchVideoCardSkeleton from '../components/video/WatchVideoCardSkeleton'

const LikedVideo = () => {
  const [likedVideos, setLikedVideos] = useState<any[]>([])
  const [likedVideosCount, setLikedVideosCount] = useState(0)
  const [dislikedVideosCount, setDislikedVideosCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToastContext()

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        setIsLoading(true)
        const res = await getLikedVideos()
        setLikedVideos(res.data.likedVideos)
        setLikedVideosCount(res.data?.LikedCount)
        setDislikedVideosCount(res.data?.DisliedCount)
      } catch (error) {
        console.log('Failed to fetch liked videos', error);
        toast.error('Failed to fetch liked videos')
      } finally {
        setIsLoading(false)
      }
    }
    fetchLikedVideos()
  }, [])

  return (
     <div className="flex w-full justify-center lg:justify-end lg:p-7">  
      <div className="flex flex-col-reverse lg:flex-row lg:w-[85vw]">
        <div className="lg:w-[45vw] w-full flex flex-col p-2 lg:p-0 gap-2">
          {isLoading
            ? (
                Array.from({ length: 7 }).map((_, i) => (
                <WatchVideoCardSkeleton key={i} videoWidth="lg:w-2/5 w-1/2" />
            ))
            ) : (<>{likedVideos && likedVideos.map((video) => (
            <WatchVideoCard
              key={video?._id}
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
            />
          ))}</>)}
        </div>
        <div className="flex flex-col lg:pt-35 lg:pl-30 px-3 lg:px-0">
          <div className="flex items-center gap-2 border-b py-2 my-5">
            <Search className='text-lg cursor-pointer' />
            <input placeholder='Search liked video' className='border-none focus:outline-none' />
          </div>
          <p>Liked videos: {likedVideosCount}</p>
          <p>Disliked videos: {dislikedVideosCount}</p>
        </div>
      </div>
    </div>
  )
}

export default LikedVideo