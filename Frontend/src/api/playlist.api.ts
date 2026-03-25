import api from './axios'

type playlist = {
    name: string,
    description?: string
    isPrivate: boolean
}

type updatePlaylistPayload = Partial<playlist>
const createPlaylist = async (name: string) => {
    
    const res = await api.post("/playlists", {name})
    return res.data
}

const getUserPlaylists = async (videoId: string) => {
    
    const res = await api.get(`/playlists/user/${videoId}`)
    return res.data
}

const getPlaylist = async (playlistId: string) => {
    
    const res = await api.get(`/playlists/${playlistId}`)
    return res.data
}

const addVideoToPlaylist = async (playlistId: string, videoId: string) => {
    
    const res = await api.patch(`/playlists/add/${videoId}/${playlistId}`)
    return res.data
}

const removeVideoFromPlaylist = async (playlistId: string, videoId: string) => {
    
    const res = await api.patch(`/playlists/remove/${videoId}/${playlistId}`)
    return res.data
}

const deletePlaylist = async (playlistId: string) => {
    
    const res = await api.delete(`/playlists/${playlistId}`)
    return res.data
}

const updatePlaylist = async (playlistId: string, updateDetails: updatePlaylistPayload) => {
    
    const res = await api.patch(`/playlists/${playlistId}`, updateDetails)
    return res.data
}

const savePlaylist = async (playlistId: string) => {
    
    const res = await api.patch(`/playlists/save/${playlistId}`)
    return res.data
}

const removeFromSavedPlaylist = async (playlistId: string) => {
    
    const res = await api.patch(`/playlists/unsave/${playlistId}`)
    return res.data
}

const getSavedPlaylists = async () => {
    
    const res = await api.get(`/playlists/saved`)
    return res.data
}

const addToWatchLater = async (videoId: string) => {
    
    const res = await api.patch(`/playlists/watch-later/add/${videoId}`)
    return res.data
}

const removeFromWatchLater = async (videoId: string) => {
    
    const res = await api.patch(`/playlists/watch-later/remove/${videoId}`)
    return res.data
}

const getWatchLaterVideos = async () => {
    
    const res = await api.get(`/playlists/watch-later`)
    return res.data
}

const isVideoInWatchLater = async (videoId: string) => {
    
    const res = await api.get(`/playlists/watch-later/check/${videoId}`)
    return res.data
}

interface allPlaylistsProp {
    page?: number
    limit?: number
    type?: string
}

const getAllPlaylists = async ({page=1, limit=10, type='all'}: allPlaylistsProp) => {
    
    const res = await api.get('/playlists/all',
      {
            params: { page, limit, type}
      } 
    )
    return res.data
}

const getPublicPlaylists = async (
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    search?: string
) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy
    })

    if (search) {
        params.append('search', search)
    }

    const res = await api.get(`/playlists/public?${params}`)
    return res.data
}

const checkPlaylistSaved = async (playlistId: string) => {

    const res = await api.get(`/playlists/check-saved/${playlistId}`)
    return res.data
}

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    savePlaylist,
    removeFromSavedPlaylist,
    getSavedPlaylists,
    addToWatchLater,
    removeFromWatchLater,
    getWatchLaterVideos,
    isVideoInWatchLater,
    getAllPlaylists,
    getPublicPlaylists,
    checkPlaylistSaved
}
