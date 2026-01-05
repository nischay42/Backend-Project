import api from './axios'


const toggleSubscription = async (channelId: string) => {
    
    const res = await api.post(`/c/${channelId}`)

    return res.data
}


const getSubscribedChannels = async (subscriberId: string) => {
    
    const res = await api.get(`/c/${subscriberId}`)

    return res.data
}

const getChannelSubscribers = async (channelId: string) => {
    
    const res = await api.get(`/u/${channelId}`)
    return res.data
}

export {
    toggleSubscription,
    getSubscribedChannels,
    getChannelSubscribers
}