import VideoCard from "../components/video/VideoCard"
import { getAllVideo } from "../api/video.api"
import { useEffect, useState, useRef } from "react"
import { useToastContext } from "../context/ToastContext"
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Home = () => {
  const [videos, setVideos] = useState<any[]>([])
  const toast = useToastContext()
  const [category, setCategory] = useState("All")
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const videoCategory = [
   "All",
   "Entertainment",
   "Music",
   "Gaming",
   "People & Blogs",
   "Comedy",
   "How to & Style",
   "Education",
   "Science & Technology",
   "Sports",
   "Film & Animation"
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      
      const limit = 12
      try {
        const res = await getAllVideo(limit, category)
        setVideos(res.data)
      } catch (error) {
        console.log(error);
        
        toast.error("Failed to fetch videos")
      }
    }
    fetchVideos()
  }, [category])
  
  
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])
  

  return (
    <div className="w-full ">
        <div className="relative w-full h-auto">
          {showLeftButton && (
            <ChevronLeft 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white"
            />
          )}
          <div
            id='horizontal'
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-2 mt-3 overflow-x-auto overflow-y-hidden w-full scrollbar-hide scroll-smooth px-4"
          >
            {videoCategory.map((catego) => (
              <button
                key={catego}
                onClick={() => setCategory(catego)}
                className={`px-4 py-2 text-sm whitespace-nowrap border shrink-0 transition-all duration-200 cursor-pointer
                  ${
                    category === catego
                    ? "bg-[#AE7AFF] text-white border-[#AE7AFF]"
                    : "bg-transparent text-white hover:bg-gray-800"
                  }`}
              >
                {catego}
              </button>
            ))}
          </div>
          {showRightButton && (
            <ChevronRight 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white"
            />
          )}

          {showLeftButton && (
            <div className="absolute left-0 top-0 h-full w-12 bg-linear-to-r from-black to-transparent pointer-events-none z-5" />
          )}
          {showRightButton && (
            <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-l from-black to-transparent pointer-events-none z-5" />
          )}
      </div>
      <div className="flex flex-wrap p-4 gap-3">
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

export default Home