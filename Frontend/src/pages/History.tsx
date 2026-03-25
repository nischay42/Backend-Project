import { useEffect, useState } from 'react'
import { userWatchHistory } from '../api/user.api'
import { useToastContext } from '../context/ToastContext'
import WatchVideoCard from '../components/video/WatchVideoCard'
import { Pause, Search, Trash2 } from 'lucide-react'
import WatchVideoCardSkeleton from '../components/video/WatchVideoCardSkeleton'

const History = () => {
  const [watchHistory, setWatchHistory] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToastContext()

  useEffect(() => {
    const fetchWatchHistory = async () => {
      setIsLoading(true)
      try {
        const res = await userWatchHistory()
        setWatchHistory(res.data)
      } catch (error: any) {
        console.log('Failed to fetch watch history', error);
        toast.error('Failed to fetch watch history')
      } finally {
        setIsLoading(false)
      }
    }
    fetchWatchHistory()
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
            ) :(<>{watchHistory && watchHistory.map((history) => (
            <WatchVideoCard
             key={history?._id}
             fullname={history.owner.fullname}
             username={history.owner.username}
             thumbnail={history.thumbnail}
             videoFile={history.videoFile}
             avatar={history.owner.avatar}
             duration={history.duration}
             title={history.title}
             views={history.views}
             createdAt={history.createdAt}
             videoId={history._id}
            />
          ))}</>)}
        </div>
        <div className="flex flex-col lg:pt-35 lg:pl-30 px-3 lg:px-0">
          <div className="flex items-center gap-2 border-b py-2 my-5">
            <Search className='text-lg cursor-pointer' />
            <input placeholder='Search watch history' className='border-none focus:outline-none' />
          </div>

          <div className="flex items-center gap-2 lg:py-2 cursor-pointer">
            <Trash2 size={20} />
            <p>Clear all Watch history</p>
          </div>

          <div className="flex items-center gap-2 py-2 cursor-pointer">
            <Pause size={20} />
            <p>Pause watch history</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default History