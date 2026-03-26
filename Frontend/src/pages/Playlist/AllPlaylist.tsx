import { useEffect, useState} from 'react'
import { useToastContext } from '../../context/ToastContext'
import { getAllPlaylists } from '../../api/playlist.api'
import PlaylistCard from '../../components/channel/PlaylistCard'
import VideoCardSkeleton from '../../components/video/VideoCardSkeleton'

const AllPlaylist = () => {
    const [allPlaylists, setAllPlaylists] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToastContext()

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true)
            try {
                const res = await getAllPlaylists({})
                setAllPlaylists(res.data.playlists)                
            } catch (error) {
                console.log('Failed to fetch playlists', error);
                toast.error('Failed to fetch playlists')
            } finally {
              setIsLoading(false)
            }
        }
        fetchPlaylists()
    }, [])    
        // console.log(allPlaylists);
        
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 min-w-[80vw] pb-10">
        {isLoading
            ? (
                Array.from({ length: 9 }).map((_, i) => (
                <VideoCardSkeleton key={i} />
            ))
            ) :( <>{allPlaylists && allPlaylists.map((playlist) => (
            <PlaylistCard 
                key={playlist._id}
                thumbnail={playlist.thumbnail}
                videosCount={playlist.videosCount}
                createdAt={playlist.createdAt}
                title={playlist.name}
                isPrivate={playlist?.isPrivate}
                fullname={playlist?.owner?.fullname}
                username={playlist?.owner?.username}
                playlistId={playlist._id}
                isUserPlaylist={playlist?.owner?.fullname ? false : true}
            />
        ))}</>)}
    </div>
  )
}

export default AllPlaylist