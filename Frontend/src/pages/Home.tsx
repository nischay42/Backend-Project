import VideoCard from "../components/video/VideoCard"
import { getAllVideo } from "../api/video.api"
import { useEffect, useState, useRef, useCallback } from "react"
import { useToastContext } from "../context/ToastContext"
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getPublicPlaylists } from "../api/playlist.api";
import PlaylistCard from "../components/channel/PlaylistCard";
import VideoCardSkeleton from "../components/video/VideoCardSkeleton";

const Home = () => {
  const [videos, setVideos] = useState<any[]>([])
  const [playlist, setPlaylist] = useState<any[]>([])
  const toast = useToastContext()
  const [category, setCategory] = useState("All")
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Infinite scroll states
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isInitialLoadRef = useRef(true)

  const videoCategory = [
   "All",
   "Music",
   "Gaming",
   "Education",
   "Science & Technology",
   "Sports",
   "Film & Animation",
   "How to & Style",
   "Comedy",
   "People & Blogs",
   "Entertainment",
  ];


  const interleaveItems = (videos: any[], playlists: any[]) => {
    const result: any[] = []
    const videosWithType = videos.map(v => ({ ...v, itemType: 'video' }))
    const playlistsWithType = playlists.map(p => ({ ...p, itemType: 'playlist' }))
    
    let videoIndex = 0
    let playlistIndex = 0
    
    while (videoIndex < videosWithType.length || playlistIndex < playlistsWithType.length) {
      for (let i = 0; i < 6 && videoIndex < videosWithType.length; i++) {
        result.push(videosWithType[videoIndex++])
      }

      if (playlistIndex < playlistsWithType.length) {
        result.push(playlistsWithType[playlistIndex++])
      }
    }
    
    return result
  }
  
  const fetchVideos = async (pageNum: number, categoryFilter: string, isInitial = false) => {
    if (loadingMore && !isInitial) return

    if (isInitial) {
      setIsLoading(true)
    } else {
      setLoadingMore(true)
    }

    const limit = 12

    try {
      const res = await getAllVideo(limit, categoryFilter, pageNum, isInitial)
      const newVideos = res.data.videos
      const hasMoreVideos = res.data.hasMore

      setHasMore(hasMoreVideos)

      if (isInitial) {
        setVideos(newVideos)
        isInitialLoadRef.current = false
      } else {
        setVideos(prev => [...prev, ...newVideos])
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch videos")
    } finally {
      if (isInitial) {
        setIsLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setVideos([])
    isInitialLoadRef.current = true
    fetchVideos(1, category, true) 
  }, [category])

  useEffect(() => {
    if (page > 1) {
      fetchVideos(page, category, false)
    }
  }, [page])

  const lastItemCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage(prevPage => prevPage + 1)
        }
      },
      {
        rootMargin: '200px',
        threshold: 0.1
      }
    )

    if (node) {
      observerRef.current.observe(node)
    }
  }, [loadingMore, hasMore])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])
  
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

    const observer = new ResizeObserver(() => {
      checkScroll()
    })

    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current)
    }

    window.addEventListener('resize', checkScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkScroll)
    }
  }, [])
  
  // fetch public playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistPage = 1
      const limit = 10
      try {
        const res = await getPublicPlaylists(playlistPage, limit)
        setPlaylist(res.data.playlists)
      } catch (error) {
        console.log('Failed to fetch playlists', error);
        toast.error('Failed to fetch playlists')
      }
    }
    fetchPlaylists()
  }, [])

  // Combine videos and playlists
  const combinedItems = interleaveItems(videos, playlist)

  return (
    <div className="w-full overflow-hidden">
      {/* Category Scroller */}
      <div className="relative w-full h-auto">
        {showLeftButton && (
          <ChevronLeft 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white cursor-pointer"
          />
        )}

        {showLeftButton && (
          <div className="absolute left-0 top-0 h-full w-12 bg-linear-to-r from-black to-transparent pointer-events-none z-5" />
        )}
        {showRightButton && (
          <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-l from-black to-transparent pointer-events-none z-5" />
        )}
      </div>

      {/* Videos and Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10 p-2 lg:p-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <VideoCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : combinedItems.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            <p className="text-lg">No videos or playlists found</p>
            <p className="text-sm mt-2">Try selecting a different category</p>
          </div>
        ) : (
          <>
            {combinedItems.map((item, index) => {
              const isLastItem = index === combinedItems.length - 1

              if (item.itemType === 'video') {
                return (
                  <div 
                    key={`video-${item._id}-${index}`}
                    ref={isLastItem ? lastItemCallback : null}
                  >
                    <VideoCard
                      fullname={item.owner.fullname}
                      username={item.owner.username}
                      thumbnail={item.thumbnail}
                      avatar={item.owner.avatar}
                      videoFile={item.videoFile}
                      title={item.title}
                      views={item.views}
                      createdAt={item.createdAt}
                      duration={item.duration}
                      videoId={item._id}
                    />
                  </div>
                )
              } else {
                return (
                  <div 
                    key={`playlist-${item._id}-${index}`}
                    ref={isLastItem ? lastItemCallback : null}
                  >
                    <PlaylistCard 
                      thumbnail={item.thumbnail}
                      videosCount={item.videosCount}
                      createdAt={item.createdAt}
                      title={item.name}
                      isPrivate={item?.isPrivate}
                      fullname={item?.ownerFullname}
                      username={item?.ownerUsername}
                      playlistId={item._id}
                      isUserPlaylist={false}
                    />
                  </div>
                )
              }
            })}

            {loadingMore && (
              Array.from({ length: 4 }).map((_, i) => (
                <VideoCardSkeleton key={`loading-skeleton-${i}`} />
              ))
            )}
          </>
        )}
      </div>

      {!hasMore && !isLoading && combinedItems.length > 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-sm">No more videos to load</p>
        </div>
      )}
    </div>
  )
}

export default Home