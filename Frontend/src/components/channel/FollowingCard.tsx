import { profile } from "../../assets"
import Button from "../Button"

const FollowingCard = () => {
  return (
    <div className="flex justify-between items-center">
        <div className="flex">
            <div className="flex gap-1">
                <div className="h-12 w-12">
                    <img src={profile} srcSet="" className="h-10 w-10 rounded-full" />
                </div>
                <div>
                    <p className="font-semibold">Chai aur Code</p>
                    <p className="font-light">1M followers</p>
                </div>
            </div>
        </div>
        <div>
            <Button children="Subscribed" padding="px-4 py-1.5" className="bg-white text-black" />
        </div>
    </div>
  )
}

export default FollowingCard