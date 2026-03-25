import api from './axios'


const toggoleVideoLike = async (videoId: string, reactionType: string) => {
    
    const res = await api.post(`/likes/v/${videoId}/${reactionType}`)
    return res.data

}

const toggoleCommentLike = async (commentId: string, reactionType: string) => {
    
    const res = await api.post(`/likes/c/${commentId}/${reactionType}`)
    return res.data
}

const toggoleTweetLike = async (tweetId: string, reactionType: string) => {
    
    const res = await api.post(`/likes/t/${tweetId}/${reactionType}`)
    return res.data
}

const getLikedVideos = async () => {
    
    const res = await api.post(`/likes/videos`)
    return res.data
}

const getVideoLikes = async (videoId: string) => {
    
    const res = await api.get(`/likes/v/${videoId}`)
    return res.data
}
const getCommentLikes = async (commentId: string) => {
    
    const res = await api.get(`/likes/c/${commentId}`)
    return res.data
}
const getTweetLikes = async (tweetId: string) => {
    
    const res = await api.get(`/likes/t/${tweetId}`)
    return res.data
}

export {
    toggoleVideoLike,
    toggoleCommentLike,
    toggoleTweetLike,
    getLikedVideos,
    getVideoLikes,
    getCommentLikes,
    getTweetLikes
}