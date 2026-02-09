interface playlistProp {
    thumbnail: string
    views?: string
    videosCount?: string
    uploadedAt?: string
    title?: string
    description?: string
}

const PlaylistCard = ({
    thumbnail,
    views,
    videosCount,
    uploadedAt,
    title,
    description

}: playlistProp) => {
  return (
    <div className="w-[26vw] mt-4">
        <div className="relative w-[26vw] h-56">
            <img src={thumbnail} className="w-full h-full" alt="" />
            <div className="absolute flex w-full justify-between bottom-0 backdrop-blur-xl border-t p-3 font-normal text-sm">
                <div className="">
                    <p>Playlist</p>
                    <div className="flex gap-2 font-light">
                        <p>100K Views</p>
                        <p>•</p>
                        <p>18 hours ago</p>
                    </div>
                </div>
                <div className="">
                    <p>32 videos</p>
                </div>
            </div>
        </div>
        <div className="font-medium text-xl mt-3 flex justify-between">
            <p>How to become 1 percent</p>
            <p className="mr-2">⋮</p>
        </div>
        <div className="text-sm mt-1">
            <p>If you're a developer, be sure to check out the
                lastest updatesto google and pices to make your 
                coding workflow even more eficeient</p>
        </div>
    </div>
  )
}

export default PlaylistCard