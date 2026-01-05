import api from './axios'

type videoLike = {
    videoId: string,
    type: string
}
const toggoleVideoLike = async (params: videoLike) => {
    
    const res = await api.post(`/v/${params.videoId}/${params.type}`)
    return res.data

}

type commentLike = {
    commentId: string,
    type: string
}

const toggoleCommentLike = async (params: commentLike) => {
    
    const res = await api.post(`/c/${params.commentId}/${params.type}`)
    return res.data
}

type tweeetLike = {
    tweetId: string,
    type: string
}

const toggoleTweetLike = async (params: tweeetLike) => {
    
    const res = await api.post(`/t/${params.tweetId}/${params.type}`)
    return res.data
}

const getLikedVideos = async () => {
    
    const res = await api.post("/videos")
    return res.data
}

export {
    toggoleVideoLike,
    toggoleCommentLike,
    toggoleTweetLike,
    getLikedVideos
}