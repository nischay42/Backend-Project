import { plus, follow, following } from '../../assets'
import ChannelTabs from './ChannelTabs'
import { profile } from '../../assets'
import UIButton from '../UIButton'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppSelector } from '../../app/hooks'
import type { RootState } from "../../app/store.ts"
import { toggleSubscription, getChannelSubscribers } from '../../api/subscription.api.ts'
import { useToastContext } from '../../context/ToastContext.tsx'
// import { resolveMediaUrl } from '../../utils/mediaUrl'


interface ChannelPayload {
  avatar: string
  coverImage: string
  fullname: string
  username: string
  subscribers: number
  subscribed: number
  isSubscribed: boolean
  _id: string
}

interface Props {
  details: ChannelPayload
}

const ChannelHeader = ({ details }: Props) => {

  const username  = useAppSelector((state: RootState) => state.auth.user?.username)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [subscribersCount, setSubscribersCount] = useState(details.subscribers)
  const [isFollowing, setIsFollowing] = useState(details?.subscribers || false)
  const isUser = username === details.username
  const channelId = details._id 
  const toast = useToastContext()
  // const resolvedCoverImage = resolveMediaUrl(details.coverImage) || details.coverImage
  // const resolvedAvatar = resolveMediaUrl(details.avatar) || details.avatar || profile
  

  // handle subscription
    const handleSubscription = async() => {
        if (isAuthenticated) {
            await toggleSubscription(channelId)
            setIsFollowing(!isFollowing)
            if (!isFollowing) toast.success("Channel Subscribed")
            else {
                toast.info("Channel Unsubscribed") 
                setIsFollowing(!isFollowing)
            }
        }
        else toast.warning('Please Login/Signup to Subscribe', 3000)
    }

  // fetch subscribers
    useEffect(() => {
      if (!channelId) return
      const fetchSubscribers = async () => {
        try {        
          const res = await getChannelSubscribers(channelId)
          setIsFollowing(res.data?.isSubscribed)        
          setSubscribersCount(res.data?.subscribersCount);
        } catch (error) {
          console.log("Failed to fetch Subscribers count", error);
          toast.error("Failed to fetch Subscribers count")
        }
      }
      fetchSubscribers()
    }, [isFollowing])

  return (
    <div className='h-auto min-w-[80vw] overflow-auto'>
        <div className="w-full h-25 lg:h-40">
          <img src={details.coverImage} className='w-full h-full object-cover object-center' />
        </div>
        <div className="min-w-[80vw] ">
            <div className="min-w-[80vw] lg:h-[9vw] flex justify-between items-center">
             <div className="lg:flex">
               <div className=" h-25 w-25 lg:h-[10vw] lg:w-[10vw] bg-black rounded-full ml-5 lg:ml-7 -mt-12 lg:-mt-4">
                <img src={details.avatar || profile} className='h-25 w-25 lg:h-[10vw] lg:w-[10vw] rounded-full bg-transparent border-3 border-black object-cover object-center' />
               </div>
               <div className="ml-5 lg:ml-2">
                <div className="lg:mt-10">
                 <h1 className='text-3xl font-semibold capitalize'>{details.fullname}</h1>
                 <h2 className='font-normal text-sm lowercase'>@{details.username}</h2>
                 <div className="flex font-normal gap-2 text-sm">
                   <h2>{subscribersCount} {subscribersCount > 1 ? 'Subscribers' : 'Subscriber'} </h2>
                   <p>•</p>
                   <h2>{details.subscribed} Subscribed</h2>
                 </div>
                </div>
               </div>
             </div>
             <div className="flex">
              {isUser 
              ? <Link to="upload" >
                  <UIButton 
                    children='Create' icon={plus} 
                    className='gap-2 mr-4' padding='px-4 py-2.5' 
                    imgClass='h-5 w-5' 
                  />
                </Link> 
              : (details.isSubscribed
                ? <UIButton children='Subscribed' className='bg-white' />
                : (!isFollowing
                  ? <UIButton 
                        icon={follow} 
                        children='Subscribe'
                        textColor='white' 
                        padding='px-4 py-2.5' 
                        className='gap-2 mr-2'
                        onClick={handleSubscription}
                    />
                  : <UIButton
                      icon={following}
                      children='Subscribed' 
                      bgColor='bg-white'
                      padding='px-3 py-2.5' 
                      className='gap-2 mr-2'
                      onClick={handleSubscription}
                  />
                  
                )
                )
              }

             </div>
            </div>
            <div className="flex h-12 px-2 lg:p-0">
              <ChannelTabs />
            </div>
            <div className=" h-0.5 mt-5 mx-2 lg:mx-0 bg-white" />
        </div>
    </div>
  )
}

export default ChannelHeader
