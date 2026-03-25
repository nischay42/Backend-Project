import { Outlet, useParams } from "react-router-dom"
import ChannelHeader from "../components/channel/ChannelHeader"
import { getChannelProfile } from "../api/user.api"
import { useEffect, useState } from "react"

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


const ChannelLayout = () => {
  const [details, setDetails] = useState<ChannelPayload | null>(null)
  const { username } = useParams()
  

  

  useEffect(() => {
    const str = username
    const user = str?.slice(1)
    if (!user) return
    const fetchUser = async (user: string) => {
      try {
        const res = await getChannelProfile(user)
        setDetails(res.data)        
      } catch (error) {
        console.log('user details not fetched');
      }
    }
    fetchUser(user)
  }, [username])
   


  return (
    <div className="h-screen w-full lg:px-5">
     {details && <ChannelHeader details={details} />}
      <div className="p-2 lg:p-0">
        <Outlet context={{ channelId: details?._id, username: details?.username }} />
      </div>
    </div>
  )
}

export default ChannelLayout