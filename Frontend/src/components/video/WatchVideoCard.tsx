import {  profile } from "../../assets"
import { useState } from "react"
import { getTimeAgo } from "../../utils/timeAgo";
import { useNavigate } from "react-router-dom";
import VideoCardMenu from "./VideoCardMenu";


interface videoProp  {
    fullname: string
    username: string
    thumbnail: string
    avatar: string
    videoFile: string
    duration: string
    title: string
    views: string
    createdAt: string
    videoId: string
    detailWidth?: string
    videoWidth?: string
    isPlaylistViewCard?: boolean
    playlistId?: string
    isUserPlaylist?: boolean
    videoHeight?: string
    titleSize?: string
    avatarSize?: string
    usernameSize?: string
}

const WatchVideoCard = ({
    fullname,
    username,
    thumbnail,
    videoFile,
    duration,
    title,
    views,
    createdAt,
    videoId,
    avatar,
    isPlaylistViewCard,
    playlistId,
    isUserPlaylist,
    detailWidth='w-full',
    videoWidth='lg:w-[25vw] md:w-[10vw] w-full',
    videoHeight='h-30 md:h-50 lg:h-[20vh]',
    titleSize='lg:text-md',
    avatarSize='lg:h-7 lg:w-7',
    usernameSize='lg:text-sm'
}: videoProp) => {
    const [isHovering, setIsHovering] = useState(false);
    // const [maxLength, setMaxLength] = useState(40)
    const navigate = useNavigate()
    
    const isMobile = window.innerWidth < 768
    const maxLength = isMobile ? 30 : 40
    const textBreak = title.replace(new RegExp(`^(.{${maxLength}}\\S*).*`),'$1...')

    const handleMouseLeave = () => {
      setIsHovering(false)
    }
  
    const handleMouseEnter = () => {
      setIsHovering(true)
    }

  return (
    <div 
      className={`border border-[#ffffffc4] p-0.5 lg:p-1 ${videoHeight} relative cursor-pointer`}
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        navigate(`/watch?v=${videoId}`);
      }}
    >
      <div 
        className="flex z-0 top-0 h-full w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // onTouchStart={handleMouseEnter}
        // onTouchEnd={handleMouseLeave}
      >        
      <div className={`relative ${videoWidth} `}>
          {!isHovering && (
            <img src={thumbnail} alt="Thumbnail" className={`${videoWidth} h-full transition-all duration-800 ease-in-out opacity-100 ${isHovering ? 'opacity-0' : ''}`} />
          )}

          {isHovering && (
            <video 
              src={videoFile} 
              autoPlay
              preload="metadata"
              muted
              className={`${videoWidth} h-full transition-all duration-1000 ease-in-out opacity-0 ${isHovering ? 'opacity-100' : ''}`} 
            />
          )}

          {!isHovering && (
            <div className="absolute text-xs bg-black/80 right-[1vw] bottom-[0.4vw] px-1.5 py-0.5 rounded-sm font-semibold">
              <p>{duration}</p>
            </div>
          )}
        </div>
          {/* menu */}
            <VideoCardMenu 
              videoId={videoId}
              isPlaylistViewCard={isPlaylistViewCard}
              playlistId={playlistId}
              isUserPlaylist={isUserPlaylist}
            />
        <div className={`flex ${detailWidth} pl-2 h-full relative `}>
          <div className="flex flex-col justify-between">
            <div className="md:text-sm lg:text-md lg:font-medium">
              <p className={`text-sm ${titleSize} lg:font-medium`}>{textBreak}</p>
            </div>
            <div >
              <div className=" text-white text-sm lg:text-lg flex items-center gap-2">
                <div className={`flex w-6 ${avatarSize}`}>
                  <img 
                    onClick={(e) => {
                      e.stopPropagation()
                      if(username) navigate(`/@${username}`)
                    }}
                    src={avatar || profile}
                    className={`h-6 w-6  ${avatarSize} rounded-full object-cover object-center`}
                  />
                </div>
                <p 
                  className={`capitalize ${usernameSize}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if(username) navigate(`/@${username}`)
                  }} 
                >{fullname}</p>
              </div>
              <div className={`flex gap-2 mt-1 text-xs ${usernameSize} font-light text-white `}>
                <p>{views} Views</p>
                <p>•</p>
                <p>{getTimeAgo(createdAt)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default WatchVideoCard
