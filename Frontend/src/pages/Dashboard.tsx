// pages/Dashboard.tsx
import { useState, useEffect } from 'react'
import { Eye, UserRoundCheck, Heart, Pencil, Trash2 } from 'lucide-react'
import { getChannelStats, getChannelVideosStats } from '../api/dashboard.api'
import { deleteVideo, togglePublisherStatus  } from '../api/video.api'
import { useNavigate } from 'react-router-dom'
import { useToastContext } from '../context/ToastContext'
import Button from '../components/Button'
import { plus } from '../assets'
import { useAppSelector } from '../app/hooks'
import { type RootState } from '../app/store'
import ToggleSwitch from '../components/ToggleSwitch'

interface Video {
  _id: string
  title: string
  thumbnail: string
  views: number
  likesCount: number
  dislikesCount: number
  isPublished: boolean
  createdAt: string
}

interface Stats {
  totalViews: number
  totalSubscribers: number
  totalLikes: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({ totalViews: 0, totalSubscribers: 0, totalLikes: 0 })
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const fullname  = useAppSelector((state: RootState) => state.auth.user?.fullname)
  const navigate = useNavigate()
  const toast = useToastContext()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const [statsRes, videosRes] = await Promise.all([
        getChannelStats(),
        getChannelVideosStats()
      ])
      setStats(statsRes.data)
      setVideos(videosRes.data?.videos)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    })
  }

  const handleTogglePublish = async (videoId: string, currentStatus: boolean) => {
    try {
      await togglePublisherStatus(videoId, !currentStatus)      
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !currentStatus } : v
      ))
    } catch (error) {
      toast.error('Failed to toggle publish status')
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    
    try {
      await deleteVideo(videoId)
      setVideos(videos.filter(v => v._id !== videoId))
      toast.success('Video deleted successfully')
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const handleEdit = (videoId: string) => {
    navigate(`/edit-video/${videoId}`)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="lg:flex lg:justify-between mb-8">
        <div className="">
          <h1 className="text-2xl font-semibold mb-1">Welcome, <span className='capitalize'>{fullname}</span></h1>
          <h2>Creator dashboard</h2>
        </div>
      {/* Video Upload Button */}
      <div className="lg:flex lg:justify-end h-11 mt-5 lg:mt-0">
        <Button children='Upload Video' icon={plus} />
      </div>
      </div>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Views */}
        <div className="border py-3">
          <div className="flex items-center justify-center bg-[#101014] w-17 h-17 rounded-full mb-4 ml-3">
            <div className="flex items-center justify-center p-3 bg-[#E4D3FF] rounded-full">
              <Eye className="w-6 h-6 text-[#AE7AFF]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1 ml-5">Total Views</p>
          <p className="text-3xl font-semibold ml-5">{formatNumber(stats.totalViews)}</p>
        </div>

        {/* Total Followers */}
        <div className="border py-3">
          <div className="flex items-center justify-center bg-[#101014] w-17 h-17 rounded-full mb-4 ml-3">
            <div className="flex items-center justify-center p-3 bg-[#E4D3FF] rounded-full">
              <UserRoundCheck className="w-6 h-6 text-[#AE7AFF]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1 ml-5">Total Subscribers</p>
          <p className="text-3xl font-semibold ml-5">{formatNumber(stats.totalSubscribers)}</p>
        </div>

        {/* Total Likes */}
        <div className="border py-3">
          <div className="flex items-center justify-center bg-[#101014] w-17 h-17 rounded-full mb-4 ml-3">
            <div className="flex items-center justify-center p-3 bg-[#E4D3FF] rounded-full">
              <Heart className="w-6 h-6 text-[#AE7AFF]" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1 ml-5">Total Likes</p>
          <p className="text-3xl font-semibold ml-5">{formatNumber(stats.totalLikes)}</p>
        </div>
      </div>

      {/* Videos Table */}
      <div className="overflow-x-auto mb-10">
        <div className='border border-white rounded-lg min-w-300'>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 whitespace-normal px-6 py-3 text-sm y-400 border-b border-white ">
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-4">Uploaded</div>
          <div className="col-span-2">Rating</div>
          <div className="col-span-2">Date uploaded</div>
          <div className="col-span-2"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                <div className="col-span-1 h-8 bg-gray-800 rounded"></div>
                <div className="col-span-1 h-8 bg-gray-800 rounded"></div>
                <div className="col-span-4 h-8 bg-gray-800 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-800 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-800 rounded"></div>
                <div className="col-span-2 h-8 bg-gray-800 rounded"></div>
              </div>
            ))
          ) : videos.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              No videos uploaded yet
            </div>
          ) : (
            videos.map((video) => (
              <div key={video._id} className="grid grid-cols-12 gap-4 px-6 items-center hover:bg-gray-900/50 transition-colors">
                {/* Toggle Switch */}
                <div className="col-span-1">
                  <ToggleSwitch 
                    checked={video.isPublished}
                    onChange={() => handleTogglePublish(video._id, video.isPublished)}
                  />
                </div>

                {/* Status Badge */}
                <div className="col-span-1">
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    video.isPublished
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                  }`}>
                    {video.isPublished ? 'Published' : 'Unpublished'}
                  </span>
                </div>

                {/* Video Info */}
                <div className="col-span-3 flex items-center gap-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                </div>

                {/* Rating */}
                <div className="col-span-3 flex items-center justify-center gap-2 text-sm font-medium border py-6 bg-white">
                  <span className="text-[#2E8178] bg-[#F0FDF9] px-3  rounded-full">{formatNumber(video.likesCount)} likes</span>
                  <span className="text-[#B42318] bg-[#FEF3F2] px-3  rounded-full">{formatNumber(video.dislikesCount)} Dislikes</span>
                  <span className="text-purple-400 bg-[#eae3f763] px-3  rounded-full">{formatNumber(video.views)} Views</span>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm">
                  {formatDate(video.createdAt)}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    // onClick={() => handleEdit(video._id)}
                    className="p-2 hover:bg-gray-800 rounded transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard