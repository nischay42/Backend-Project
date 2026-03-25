import FollowingCard from '../../components/channel/FollowingCard'
import { search } from '../../assets'
import { useEffect, useState } from 'react'
import { href, useOutletContext } from 'react-router-dom'
import { getChannelSubscribersList } from '../../api/subscription.api'
import { useToastContext } from '../../context/ToastContext'

type ChannelContext = {
  channelId: string
}
const Following = () => {
  const { channelId } = useOutletContext<ChannelContext>()
  const [subscribers, setSubscribers] = useState<any[]>([])
  const toast = useToastContext()

  useEffect(() => {
    if (!channelId) return
    const fetchSubscribers = async () => {
      try {                
        const res = await getChannelSubscribersList(channelId)
        setSubscribers(res.data?.subscribers);
      } catch (error) {
        console.log("Failed to fetch Subscribers", error);
        toast.error("Failed to fetch Subscribers")
      }
    }
    fetchSubscribers()
  }, [channelId])
  

  return (
    <div className="transition-all duration-500 min-w-[80vw] pb-10">
      <div className="flex items-center gap-3 border border-[#D0D5DD] px-3 py-2 w-full mb-6">
        <button className='cursor-pointer flex items-center'>
         <img src={search} alt="searchIcon" />
        </button>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-white placeholder-white focus:outline-none"
        />
      </div>
      {subscribers && 
      subscribers.map((subscriber) => (
        <FollowingCard 
          key={subscriber.subscriberId}
          avatar={subscriber.avatar}
          isSubscribed={subscriber.isSubscribed}
          username={subscriber.username}
          subscribersCount={subscriber.subscribersCount}
          subscriberId={subscriber.subscriberId}
        />
        ))
      }
    </div>
  )
}

export default Following