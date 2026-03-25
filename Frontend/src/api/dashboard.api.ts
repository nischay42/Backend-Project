import api from './axios'


const getChannelStats = async () => {
    
    const res = await api.get("/dashboard/c/stats")
    return res.data
}
const getChannelVideosStats = async (page: number=1, limit: number=10) => {
    
    const res = await api.get(`/dashboard/v/stats?page=${page}&limit=${limit}`)
    return res.data
}

const getChannelVideo = async (userId: string, sortType: string) => {
    
    const res = await api.get(`/dashboard/v/${userId}`,
        {
            params: { sortType: sortType }
        }
    )
    return res.data
}

export {
    getChannelStats,
    getChannelVideosStats,
    getChannelVideo
}