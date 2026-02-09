import api from "./axios";

const getAllVideo = async (limit: number, category: string) => {
    const params = new URLSearchParams()
    params.append('limit', limit.toString())
    if(category) params.append('category', category)

    const res = await api.get(`/videos?${params.toString()}`)
    
    return res.data
}

type publishVideoPayload = {
    videoFile: File
    thumbnail: File
    title: string
    description: string
    category: string
    isPublished: boolean
}

const publishVideo = async ( payload: publishVideoPayload) => {
    const formData = new FormData()
   
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('category', payload.category)
    formData.append('videoFile', payload.videoFile)
    formData.append('thumbnail', payload.thumbnail)
    formData.append('isPublished', String(payload.isPublished))


    const res = await api.post('/videos', formData, {
        headers: {
            'Content-type': 'multipart/form-data'
        }
    })
    return res.data
}

const deleteVideo = async (videoId: string) => {
    
    const res = await api.delete(`/${videoId}`)
    return res.data
}

type UpdateVideoPayload = {
    title?: string;
    description?: string;
    isPublished?: boolean;
    category?: string;
    thumbnail?: File;
};

const updateVideo = async (videoId: string, updateDetails: UpdateVideoPayload) => {
    
    const formData = new FormData();

    if (updateDetails.title)
        formData.append("title", updateDetails.title);

    if (updateDetails.description)
        formData.append("description", updateDetails.description);

    if (typeof updateDetails.isPublished !== "undefined")
        formData.append("isPublished", String(updateDetails.isPublished));

    if (updateDetails.category)
        formData.append("category", updateDetails.category);

    if (updateDetails.thumbnail)
        formData.append("thumbnail", updateDetails.thumbnail);

    const res = await api.patch(`/${videoId}`, formData)
    return res.data
}

const togglePublisherStatus = async (videoId: string, toggleStatus: boolean) => {
    
    const res = await api.patch(`/toggle/publish/${videoId}`, toggleStatus)
    return res.data
}

export {
    getAllVideo,
    deleteVideo,
    updateVideo,
    togglePublisherStatus,
    publishVideo
}