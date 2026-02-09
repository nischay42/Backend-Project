import { thumbsUp, thumbsDown, profile } from "../../assets"

const TweetCard = () => {
  return (
    <div className="mt-4">
        <div className="w-full bg-[#EAECF0] h-px"></div>
        <div className="flex mt-3 gap-2">
            <div className="">
                <img  alt="" srcSet={profile} className="h-10 w-10 rounded-full" />
            </div>
            <div className="text-sm">
                <div className="flex gap-4  font-semibold">
                    <p>Jacob Smith</p>
                    <p className="text-[#5B5B5B]">Today 07:16</p>
                </div>
                <div className="font-normal mt-1">
                    <p>This Course will help lot of people like me to understand react from its core</p>
                </div>
                <div className="flex gap-5 items-center mt-3">
                    <div className="flex gap-2">
                        <img src={thumbsUp} alt="" />
                        <p>53.53K</p>
                    </div>
                    <div className="flex gap-2">
                        <img src={thumbsDown} alt="" />
                        <p>500</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TweetCard