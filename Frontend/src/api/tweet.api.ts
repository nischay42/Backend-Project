import api from "./axios";


const createTweet = async (content: String) => {
    
    const res = await api.post('/tweets', { content })
    
    return res.data
}

export {
    createTweet
}