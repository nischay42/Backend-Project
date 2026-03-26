import { useState, useEffect } from 'react'
import WatchVideoCard from '../components/video/WatchVideoCard'
import WatchVideoCardSkeleton from '../components/video/WatchVideoCardSkeleton'
// import VideoCard from '../components/video/VideoCard'
// import VideoCardSkeleton from '../components/video/VideoCardSkeleton'
import { getAllVideo } from '../api/video.api'
import { useToastContext } from '../context/ToastContext'
import { useSearchParams } from "react-router-dom";


const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search_query");
  const [videos, setVideos] = useState<any[]>([])
//   const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  // const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const category = 'All'
  const toast = useToastContext()

//   console.log(query);

  useEffect(() => {
    fetchVideos(true) // Reset on search/category change
  }, [searchQuery, category])

  const fetchVideos = async (isInitial = false) => {
    setIsLoading(true)
    try {
      if (!searchQuery) return
      const currentPage = isInitial ? 1 : page
    //   const isRandom = isInitial && !searchQuery
      
      const res = await getAllVideo(
        12,
        'All',
        currentPage,
        false,
        searchQuery 
      )
      
      if (isInitial) {
        setVideos(res.data.videos)
        setPage(1)        
      } else {
        setVideos(prev => [...prev, ...res.data.videos])
      }
      
      // setHasMore(res.data.hasMore)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      toast.error('Failed to fetch videos')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="w-full">
        <div className="w-full flex flex-col p-2 lg:p-0 gap-2">
          {isLoading
            ? (
                Array.from({ length: 7 }).map((_, i) => (
                <WatchVideoCardSkeleton key={i} videoWidth="lg:w-2/6 w-1/2" videoHeight='h-30 md:h-50 lg:h-[30vh]' />
            ))
            ) : (<>{videos && videos.map((video) => (
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
              videoHeight='h-30 md:h-50 lg:h-[35vh]'
              videoWidth='lg:w-[40vw] md:w-[10vw] w-full'
              titleSize='lg:text-xl'
              avatarSize='h-8 w-8'
              usernameSize='lg:text-md my-4'
            />
          ))}</>)}
        </div>
    </div>
  )
}

export default SearchResult