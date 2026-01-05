import api from "./axios"

const getVideoComments = async (videoId: string, page: number, limit: number) => {
    
    const res = await api.get(`/${videoId}`, {
        params: {
            page,
            limit
        },
    })
    return res.data
}

const addComment = async (videoId: string, content: string) => {
    
    const res = await api.post(`/${videoId}`, content)
    return res.data
}

const updateComment = async (commentId: string, content: string) => {
    
    const res = await api.patch(`/c/${commentId}`, content)
    return res.data
}

const deleteCommen = async (commentId: string) => {
    
    const res = await api.delete(`/c/${commentId}`)
    return res.data
}

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteCommen
}
