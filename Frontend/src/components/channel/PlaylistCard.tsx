import { getTimeAgo } from "../../utils/timeAgo"
import { useNavigate } from "react-router-dom"
import { getPlaylist } from "../../api/playlist.api"
import PlaylistMenuCard from "./PlaylistMenuCard"
import { useAppSelector } from "../../app/hooks"

interface playlistProp {
    thumbnail: string
    videosCount: number
    createdAt: string
    title: string
    isPrivate?: boolean
    fullname?: string
    username?: string
    // videoId: string
    playlistId: string
    isUserPlaylist?: boolean
}

const PlaylistCard = ({
    thumbnail,
    videosCount,
    createdAt,
    title,
    isPrivate,
    fullname,
    username,
    // videoId,
    playlistId,
    isUserPlaylist=true,

}: playlistProp) => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAppSelector((state) => state.auth)

    // Click card = play first video with playlist context
    const handlePlaylistClick = async () => {
        try {
            const res = await getPlaylist(playlistId)
            const playlist = res.data
            
            if (playlist.videos && playlist.videos.length > 0) {
                const firstVideo = playlist.videos[0]
                // Navigate with playlistId in localStorage
                localStorage.setItem('currentPlaylist', playlistId)
                navigate(`/watch?v=${firstVideo._id}`)
            }
        } catch (error) {
            console.error('Failed to load playlist', error)
        }
    }

        // View playlist = go to playlist preview page
    const handleViewPlaylist = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigate(`/playlist-view?p=${playlistId}`)
    }


  return (
    <div 
        onClick={handlePlaylistClick}
        className="min-w-[26vw] mt-4 cursor-pointer"
    >
        <div className="relative min-w-[26vw] h-56">
            <img src={thumbnail} className="w-full h-full" alt="" />
            <div className="absolute flex w-full justify-between bottom-0 backdrop-blur-xl border-t p-3 font-normal text-sm">
                <div className="">
                    <p>Playlist</p>
                    <div className="flex gap-2 font-light">
                        <p>{getTimeAgo(createdAt)}</p>
                    </div>
                </div>
                <div className="">
                    <p>{videosCount > 1 ? `${videosCount} videos`: `${videosCount} video`}</p>
                </div>
            </div>
        </div>
        <div className=" mt-3 flex justify-between relative">
            <p className="font-medium text-xl">{title}</p>
           {isAuthenticated && 
               <PlaylistMenuCard 
                   playlistId={playlistId} 
                   isUserPlaylist={isUserPlaylist}
                />
            }
        </div>
        <div className="text-sm mt-1 flex items-center">
            <div 
                className="cursor-pointer capitalize hover:font-semibold"
                onClick={(e) => {
                    navigate(`/@${username}`)
                    e.stopPropagation()
                }}
            >
                {fullname && fullname}
            </div>
            {!fullname ? `${isPrivate && isPrivate ? 'Private' : 'Public'}` : null}
            <p className="mx-1.5">•</p>
            <p>Playlist</p>
        </div>
        <div 
            onClick={handleViewPlaylist}
            className="text-sm hover:font-semibold"
        >View Playlist</div>
    </div>
  )
}

export default PlaylistCard