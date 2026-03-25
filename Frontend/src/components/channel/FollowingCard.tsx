import { profile } from "../../assets"
import Button from "../Button"
import { toggleSubscription } from "../../api/subscription.api"
import { useAppSelector } from "../../app/hooks"
import type { RootState } from "../../app/store"
import { useToastContext } from "../../context/ToastContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface FollowingCardPayload {
    avatar: string
    isSubscribed: boolean
    username: string
    subscribersCount?: number
    subscriberId?: string
}

const FollowingCard = ({
    avatar,
    isSubscribed,
    username,
    subscribersCount,
    subscriberId
}: FollowingCardPayload) => {
    const { isAuthenticated } = useAppSelector((state) => state.auth)
    const userId  = useAppSelector((state: RootState) => state.auth.user?._id)
    const toast = useToastContext()
    const [subscriberCount, setsubscriberCount] = useState(subscribersCount ?? 0)
    const [isFollowing, setIsFollowing] = useState(isSubscribed)
    const navigate = useNavigate()
    const isSameUser = subscriberId === userId

// handle subscription
    const handleSubscription = async() => {

        if (!isAuthenticated) return toast.warning('Please Login/Signup to Subscribe', 3000)

        if (!subscriberId) return toast.warning('Invalid channel ID', 3000)

        try {
            await toggleSubscription(subscriberId)
            setIsFollowing(!isFollowing)
            if (!isFollowing) {
                setsubscriberCount(prev => prev+1)
                toast.success("Channel Subscribed")
            } else {
                toast.info("Channel Unsubscribed") 
                setsubscriberCount(prev => prev-1)
                setIsFollowing(!isFollowing)
            }
        } catch (error) {
            
        }
        if (isAuthenticated) {
           
        }
        else toast.warning('Please Login/Signup to Subscribe', 3000)
    }

  return (
    <div className="flex justify-between items-center">
        <div className="flex cursor-pointer"
        onClick={() => navigate(`/@${username}`)}
        >
            <div className="flex gap-1 items-center">
                <div className="flex items-center justify-center h-12 w-12">
                    <img src={avatar || profile} className="h-10 w-10 rounded-full object-cover object-center" />
                </div>
                <div>
                    <p className="font-semibold capitalize">@{username}</p>
                    <p className="font-light">{subscriberCount} {subscriberCount > 1 ? 'Subscribers' : 'Subscriber'} </p>
                </div>
            </div>
        </div>
        <div>
            {!isSameUser && 
              <>
                {isFollowing
                   ? <Button 
                        children="Subscribed" 
                        padding="px-4 py-1.5" 
                        className="bg-white text-black" 
                        onClick={handleSubscription}
                        />
                   : <Button 
                        children="Subscribe" 
                        padding="px-4 py-1.5" 
                        onClick={handleSubscription}
                        />  
                }
              </>
        }
        </div>
    </div>
  )
}

export default FollowingCard
