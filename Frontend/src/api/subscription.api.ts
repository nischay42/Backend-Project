import api from './axios'


const toggleSubscription = async (channelId: string) => {
    
    const res = await api.post(`/subscriptions/c/${channelId}`)

    return res.data
}


const getSubscribedChannels = async () => {
    
    const res = await api.get('/subscriptions/subscribedChannels')

    return res.data
}

const getChannelSubscribers = async (channelId: string) => {
    
    const res = await api.get(`/subscriptions/u/${channelId}`)
    return res.data
}

const getChannelSubscribersList = async (channelId: string) => {
    
    const res = await api.get(`/subscriptions/s/${channelId}`)
    return res.data
}

export {
    toggleSubscription,
    getSubscribedChannels,
    getChannelSubscribers,
    getChannelSubscribersList
}