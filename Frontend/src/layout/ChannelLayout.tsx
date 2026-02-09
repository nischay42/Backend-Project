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
  _id: number
}


const ChannelLayout = () => {
  const [details, setDetails] = useState<ChannelPayload | null>(null)
  const { username } = useParams()
  

  

  useEffect(() => {
    const str = username
    const user = str?.slice(1)
    if (user) {
      getChannelProfile(user)
      .then((res) => setDetails(res.data))
      .catch((error) => console.log(error))
    }
  }, [username])
   


  return (
    <div className="h-screen w-full">
     {details && <ChannelHeader details={details} />}
      <div className="px-6">
        <Outlet context={{ channelId: details?._id }} />
      </div>
    </div>
  )
}

export default ChannelLayout