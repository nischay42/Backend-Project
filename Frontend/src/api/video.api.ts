import api from "./axios";

// const getAllVideo = async (params:type) => {
    
// }

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
    deleteVideo,
    updateVideo,
    togglePublisherStatus
}