import api from './axios'

type playlist = {
    name: string, 
    description: string
}
const createPlaylist = async (details: playlist) => {
    
    const res = await api.post("/", details)
    return res.data
}

const getUserPlaylists = async (userId: string) => {
    
    const res = await api.get(`/user/${userId}`)
    return res.data
}

const getPlaylist = async (playlistId: string) => {
    
    const res = await api.get(`/${playlistId}`)
    return res.data
}

const addVideoToPlaylist = async (playlistId: string, videoId: string) => {
    
    const res = await api.patch(`/add/${videoId}/${playlistId}`)
    return res.data
}

const removeVideoFromPlaylist = async (playlistId: string, videoId: string) => {
    
    const res = await api.patch(`/remove/${videoId}/${playlistId}`)
    return res.data
}

const deletePlaylist = async (playlistId: string) => {
    
    const res = await api.delete(`/${playlistId}`)
    return res.data
}

const updatePlaylist = async (playlistId: string, updateDetails: playlist) => {
    
    const res = await api.patch(`/${playlistId}`, updateDetails)
    return res.data
}

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}