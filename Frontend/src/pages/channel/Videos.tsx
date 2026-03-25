import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import VideoCard from "../../components/video/VideoCard"
import { getChannelVideo } from "../../api/dashboard.api"
import VideoCardSkeleton from "../../components/video/VideoCardSkeleton"

type ChannelContext = {
  channelId: string
}

const filters = [
  { label: "Previously uploaded", sortType: "desc" },
  { label: "Oldest", sortType: "asc" }
]

const Videos = () => {
  const [active, setActive] = useState("Previously uploaded")
  const { channelId } = useOutletContext<ChannelContext>()
  const [videos, setVideos] = useState<any[]>([])
  const [sortType, setSortType] = useState('desc')
  const [isLoading, setIsLoading] = useState(true)
 
  // fetch channel videos
  useEffect(() => {
    if(!channelId) return
    const fetchVideo = async () => {
      setIsLoading(true)
      try {
        const res = await getChannelVideo(channelId, sortType)
        setVideos(res.data)
      } catch (error) {
        console.error("Failed to fetch channel videos", error)
      } finally {
        setIsLoading(false)
      }
    } 
    fetchVideo()
  }, [channelId, sortType])
  
  const handleFilterChange = (filter: typeof filters[0]) => {
    setActive(filter.label)
    setSortType(filter.sortType)
  }

  return (
    <div className="transition-all duration-500">
      {videos.length !== 0 && (
       <div className="flex gap-4 mt-3">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => handleFilterChange(filter)}
              // {filter !== active ? setSortType('asc') : setSortType('desc')}
              className={`px-4 py-1 text-sm border transition-all duration-300 cursor-pointer
                ${
                  active === filter.label
                  ? "bg-[#AE7AFF] text-white border-[#AE7AFF]"
                  : "bg-transparent text-white  hover:bg-gray-800"
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
  )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-[80vw] pb-10">
        {isLoading
            ? (
                Array.from({ length: 9 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
            ))
            ):( <>{videos && videos.map((video) => (
              <VideoCard
              key={video._id}
              fullname={video.owner.fullname}
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

export default Videos