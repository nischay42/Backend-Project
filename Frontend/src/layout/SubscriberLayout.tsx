import { useState, useEffect } from 'react'
import { getSubscribedChannels } from '../api/subscription.api'
import { useToastContext } from '../context/ToastContext'
import { profile } from '../assets'
import { Outlet, useNavigate } from 'react-router-dom'

interface subscriberDetails {
  fullname: string
  subscriberId: string
  username: string
  avatar: string
  _id: string
}

const SubscriberLayout = () => {

  const [subscribers, setSubscribers] = useState<subscriberDetails[] | null>(null)
  const [channelId, setChannelId] = useState('')
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
        console.log('Failed to fetch subscribers', error.config?.url)
        toast.error('Failed to fetch subscribers')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSubscribers()
  }, [])

  const handleSubscriber = (channelId: string, username: string) => {
    setChannelId(channelId)
    navigate(`${username}`)
  }

  return (
    <div className="p-3">
      <div className="flex gap-2">
        <div
          className='text-2xl p-1.5 w-12 h-12 text-center cursor-pointer border rounded-full'
          onClick={() => navigate('/subscribers')}
        >
          <h1>All</h1>
        </div>

        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-12 w-12 rounded-full bg-gray-700 animate-pulse" />
                <div className="h-3 w-12 rounded bg-gray-700 animate-pulse" />
              </div>
            ))
          : subscribers?.map((subscriber) => (
              <div
                key={subscriber._id}
                onClick={() => handleSubscriber(subscriber._id, subscriber.username)}
                className='cursor-pointer flex flex-col items-center gap-1'
              >
                <img
                  src={subscriber?.avatar || profile}
                  className='h-12 w-12 rounded-full object-cover object-center'
                  onError={(e) => { e.currentTarget.src = profile }}
                />
                <h1 className="text-xs text-center truncate w-12">{subscriber.fullname}</h1>
              </div>
            ))
        }
      </div>

      <div>
        <Outlet context={{ channelId }} />
      </div>
    </div>
  )
}

export default SubscriberLayout