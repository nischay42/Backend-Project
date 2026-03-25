import { Search } from "lucide-react";
import api from "./axios";

// const getAllVideo = async (
//   limit: number = 12, 
//   category: string = 'All',
//   page: number = 1,
//   isRandom: boolean = false
// ) => {
//   const params = new URLSearchParams({
//     limit: limit.toString(),
//     page: page.toString(),
//     random: isRandom ? 'true' : 'false'
//   })

//   if (category && category !== 'All') {
//     params.append('category', category)
//   }

//   const res = await api.get(`/videos?${params}`)
//   return res.data
// }

const getAllVideo = async (
  limit: number,
  category: string,
  page: number,
  random?: boolean,
  search?: string 
) => {
  try {
    
    const params: any = {
      limit,
      category,
      page,
      random: random ? 'true' : 'false'
    }
    
    if (search && search.trim() !== '') {
      params.search = search
    }
    
    const res = await api.get('/videos', {params})
    return res.data
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    throw error
  }
}

type publishVideoPayload = {
    videoFile: File
    thumbnail: File
    title: string
    description: string
    category: string
    isPublished: boolean
}

// const publishVideo = async ( 
//     payload: publishVideoPayload,
//     onProgress?: (progress: number) => void
// ) => {
//     const formData = new FormData()
   
//     formData.append('title', payload.title)
//     formData.append('description', payload.description)
//     formData.append('category', payload.category)
//     formData.append('videoFile', payload.videoFile)
//     formData.append('thumbnail', payload.thumbnail)
//     formData.append('isPublished', String(payload.isPublished))


//   try {
//     const res = await api.post('/videos', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent) => {
//         if (progressEvent.total) {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           )
//           onProgress?.(percentCompleted)
//         }
//       },
//     })

//     return res.data
//   } catch (error) {
//     throw error
//   }
// }

const publishVideo = async (
    payload: publishVideoPayload,
    onProgress?: (progress: number) => void
) => {
    const formData = new FormData()
   
    formData.append('title', payload.title)
    formData.append('description', payload.description)
    formData.append('category', payload.category)
    formData.append('videoFile', payload.videoFile)
    formData.append('thumbnail', payload.thumbnail)
    formData.append('isPublished', String(payload.isPublished))

    let simulatedProgress = 0
    const progressInterval = setInterval(() => {
        if (simulatedProgress < 90) {
            simulatedProgress += Math.random() * 3
            onProgress?.(Math.min(Math.round(simulatedProgress), 90))
        }
    }, 500)

    try {
        const res = await api.post('/videos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        clearInterval(progressInterval)
        onProgress?.(100)

        return res.data
    } catch (error) {
        clearInterval(progressInterval)
        throw error
    }
}

const deleteVideo = async (videoId: string) => {
    
    const res = await api.delete(`/videos/${videoId}`)
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
    console.log(toggleStatus);
    console.log(videoId);
    
    const res = await api.patch(`/videos/toggle/publish/${videoId}`, {toggleStatus})
    return res.data
}
 
const getVideoById = async (videoId: string) => {
    
    const res = await api.get(`/videos/${videoId}`)
    return res.data
}

const addVideoView = async (videoId: string, watchDuration?: number) => {
  try {
    const response = await api.post(`/videos/${videoId}/view`, {
      watchDuration
    })
    return response.data
  } catch (error) {
    console.error('Failed to count view:', error)
    throw error
  }
}

export {
    getAllVideo,
    deleteVideo,
    updateVideo,
    togglePublisherStatus,
    publishVideo,
    getVideoById,
    addVideoView
}