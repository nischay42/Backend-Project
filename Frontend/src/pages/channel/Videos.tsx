import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import VideoCard from "../../components/channel/VideoCard"
import { getChannelVideo } from "../../api/dashboard.api"

type ChannelContext = {
  channelId: number
}

const filters = ["Previously uploaded", "Oldest"]

const Videos = () => {
  const [active, setActive] = useState("Previously uploaded")
  const { channelId } = useOutletContext<ChannelContext>()
  const [videos, setVideos] = useState<any[]>([])
 
  useEffect(() => {
    if(!channelId) return

    const fetchVideo = async () => {
      try {
        const res = await getChannelVideo(channelId)
        setVideos(res.data)
      } catch (error) {
        console.error("Failed to fetch channel videos", error)
      }
    } 
    fetchVideo()
  }, [channelId])
  
  return (
    <div className="transition-all duration-500">
      <div className="flex gap-4 mt-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`px-4 py-1 text-sm border transition-all duration-300 cursor-pointer
                ${
                  active === filter
                  ? "bg-[#AE7AFF] text-white border-[#AE7AFF]"
                  : "bg-transparent text-white  hover:bg-gray-800"
                }`}
            >
              {filter}
            </button>
          ))}
      </div>
      <div className="flex gap-3 w-[80vw] pb-10 flex-wrap-reverse">
        {videos.map((video) => (
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
        ))}
      </div>
    </div>
  )
}

export default Videos