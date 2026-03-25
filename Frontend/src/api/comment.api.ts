import api from "./axios"

const getVideoComments = async (videoId: string, page: number, limit: number) => {

    const params = new URLSearchParams()
    params.append("page", page.toString())
    params.append('limit', limit.toString())
    const res = await api.get(`/comments/${videoId}?${params.toString()}`)
    return res.data
}

const addComment = async (videoId: string, content: string) => {
    
    const res = await api.post(`/comments/${videoId}`, {content})
    return res.data
}

const updateComment = async (commentId: string, content: string) => {
    
    const res = await api.patch(`/comments/c/${commentId}`, {content})
    return res.data
}

const deleteCommen = async (commentId: string) => {
    
    const res = await api.delete(`/comments/c/${commentId}`)
    return res.data
}

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteCommen
}
