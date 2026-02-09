import api from './axios'


const getChannelStats = async () => {
    
    const res = await api.get("/dashboard/stats")
    return res.data
}

const getChannelVideo = async (userId: number) => {
    
    const res = await api.get(`/dashboard/v/${userId}`)
    return res.data
}

export {
    getChannelStats,
    getChannelVideo
}