import api from "./axios";


const createTweet = async (content: String) => {
    
    const res = await api.post('/tweets', { content })
    
    return res.data
}

const getChannelTweets = async (userId: number) => {
    
    const res = await api.get(`/tweets/user/${userId}`)

    return res.data
}

const updateTweet = async (tweetId: string, content: string) => {
    
    const res = await api.patch(`/tweets/${tweetId}`, {content})
    return res.data
}

const deleteTweet = async (tweetId: string) => {
    
    const res = await api.delete(`/tweets/${tweetId}`)
    return res.data
}


export {
    createTweet,
    getChannelTweets,
    updateTweet,
    deleteTweet
}