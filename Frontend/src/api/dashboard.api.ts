import api from './axios'


const getChannelStats = async () => {
    
    const res = await api.get("/stats")
    return res.data
}

const getChannelVideo = async () => {
    
    const res = await api.get("/videos")
    return res.data
}

export {
    getChannelStats,
    getChannelVideo
}