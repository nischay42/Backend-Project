import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name} = req.body
    const userId = req.user?._id

    if (!name) {
        throw new ApiError(400, "Name is required")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    await Playlist.create({
        name: name,
        owner: userId
    })

   return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Playlist created successflly")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {videoId} =  req.params
    const userId =  req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is missing")
    }
    
    const userPlaylists = await Playlist.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $addFields: {
                isVideoInPlaylist: {
                    $cond: {
                        if: { 
                            $in: [
                                new mongoose.Types.ObjectId(videoId), 
                                { $ifNull: ["$videos", []] }
                            ] 
                        },
                        then: true,
                        else: false
                    }
                },
                videosCount: { 
                    $size: { $ifNull: ["$videos", []] } 
                }
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                videosCount: 1,
                isVideoInPlaylist: 1,
                owner: 1,
                createdAt: 1,
                isPrivate: 1
            }
        },
        {
            $sort: { createdAt: -1 }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, userPlaylists, "Playlistas fetched successfully")
        )
})

const getAllPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { page = 1, limit = 10, type = 'all' } = req.query

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const skip = (Number(page) - 1) * Number(limit)
    const limitNum = Number(limit)

    let matchStage = {}
    
    if (type === 'user') {
        matchStage = { owner: new mongoose.Types.ObjectId(userId) }
    } else if (type === 'saved') {
        const user = await User.findById(userId).select('savedPlaylists')
        if (!user) {
            throw new ApiError(404, "User not found")
        }
        matchStage = { 
            _id: { $in: user.savedPlaylists || [] }
        }
    } else {
        const user = await User.findById(userId).select('savedPlaylists')
        matchStage = {
            $or: [
                { owner: new mongoose.Types.ObjectId(userId) },
                { _id: { $in: user?.savedPlaylists || [] } }
            ]
        }
    }

    const rawPlaylists = await Playlist.aggregate([
        { $match: matchStage },
        
        {
            $lookup: {
                from: 'videos',
                let: { firstVideoId: { $arrayElemAt: ['$videos', 0] } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$firstVideoId'] } } },
                    { $project: { thumbnail: 1 } }
                ],
                as: 'firstVideo'
            }
        },
        
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        { $unwind: { path: '$ownerDetails', preserveNullAndEmptyArrays: true } },
        
        {
            $addFields: {
                videosCount: { $size: { $ifNull: ['$videos', []] } },
                thumbnail: { 
                    $ifNull: [
                        { $arrayElemAt: ['$firstVideo.thumbnail', 0] },
                        null
                    ]
                },
                videoId: { 
                    $ifNull: [
                        { $arrayElemAt: ['$firstVideo._id', 0] },
                        null
                    ]
                },
            }
        },
        
        {
            $project: {
                _id: 1,
                name: 1,
                thumbnail: 1,
                videoId: 1,
                videosCount: 1,
                createdAt: 1,
                isPrivate: 1,
                owner: '$owner',
                ownerFullname: '$ownerDetails.fullname',
                ownerUsername: '$ownerDetails.username'
            }
        },
        
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum }
    ])

    const playlists = rawPlaylists.map(playlist => {
        const isOwner = playlist.owner.toString() === userId.toString()
        
        if (isOwner) {
            // User's own playlist
            return {
                _id: playlist._id,
                name: playlist.name,
                thumbnail: playlist.thumbnail,
                videoId: playlist.videoId,
                videosCount: playlist.videosCount,
                createdAt: playlist.createdAt,
                isPrivate: playlist.isPrivate
            }
        } else {
            // Saved playlist
            return {
                _id: playlist._id,
                name: playlist.name,
                thumbnail: playlist.thumbnail,
                videoId: playlist.videoId,
                videosCount: playlist.videosCount,
                createdAt: playlist.createdAt,
                owner: {
                    fullname: playlist.ownerFullname,
                    username: playlist.ownerUsername
                }
            }
        }
    })

    const totalCount = await Playlist.countDocuments(matchStage)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                playlists,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalPlaylists: totalCount,
                    hasMore: skip + playlists.length < totalCount
                }
            }, "Playlists fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: 'videos',
            select: 'title thumbnail views createdAt duration videoFile',
            populate: {
                path: 'owner',
                select: 'fullname avatar username'
            }
        })
        .populate({
            path: 'owner',
            select: 'fullname avatar username'
        })
        .lean()

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // Transform to match desired structure
    const transformedPlaylist = {
        _id: playlist._id,
        name: playlist.name,
        description: playlist.description,
        isPrivate: playlist.isPrivate,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        owner: playlist.owner ? {
            _id: playlist.owner._id,
            isUser: playlist.owner._id.toString() === userId.toString(),
            fullname: playlist.owner.fullname,
            username: playlist.owner.username,
            avatar: playlist.owner.avatar
        } : null,
        videos: playlist.videos.map((video) => ({
            _id: video._id,
            title: video.title,
            thumbnail: video.thumbnail,
            views: video.views,
            createdAt: video.createdAt,
            duration: video.duration,
            videoFile: video.videoFile,
            owner: video.owner ? {
                fullname: video.owner.fullname,
                avatar: video.owner.avatar,
                username: video.owner.username,
                channelId: video.owner._id
            } : null
        }))
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, transformedPlaylist, "Playlist fetched successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Playlist Id or video Id is missing")
    }


    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: userId
    });

    if (!playlist) throw new ApiError(404, "Playlist not found or you don't have permission");

    if (!playlist.videos) {
        playlist.videos = []
    }

    const videoExists = playlist.videos.some(
        id => id.toString() === videoId
    )

    if (videoExists) {
        throw new ApiError(400, "Video already in playlist")
    }   

    // add video to playlist
    playlist.videos.push(videoId)
    await playlist.save()

    
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video added to playlist")
        );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user?._id  

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Playlist Id or video Id is missing")
    }

    const playlist = await Playlist.findOne({
        _id: playlistId,
        owner: userId
    })

    if (!playlist) {
        throw new ApiError(404, "Playlist not found or you don't have permission")
    }

    const videoExists = playlist.videos.some(
        id => id.toString() === videoId
    )

    if (!videoExists) {
        throw new ApiError(400, "Video not found in playlist")
    }

    // Remove video from playlist
    playlist.videos = playlist.videos.filter(
        id => id.toString() !== videoId
    )
    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video removed from playlist")
        );

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "playlist Id not found")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this playlist");
    }


    await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description, isPrivate} = req.body
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist Id not found")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const updates = {}
    if (typeof name !== "undefined") {
        const trimmedName = String(name).trim()
        if (!trimmedName) {
            throw new ApiError(400, 'Playlist name cannot be empty')
        }
        updates.name = trimmedName
    }
    if (typeof description !== "undefined") updates.description = description
    if (typeof isPrivate !== "undefined") updates.isPrivate = isPrivate

    if (Object.keys(updates).length === 0) {
        // Nothing to update
        throw new ApiError(400, "No fields provided to update");
    }

    // verify ownership before update
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set:  updates },
        { new: true, runValidators: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

const savePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist Id is invalid")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    // Verify playlist exists
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // Add playlist to user's savedPlaylists if not already saved
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Check if playlist is already saved
    const isPlaylistSaved = user.savedPlaylists.some(
        id => id.toString() === playlistId
    )

    if (isPlaylistSaved) {
        throw new ApiError(400, "Playlist is already saved")
    }

    // Save the playlist
    user.savedPlaylists.push(playlistId)
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, user.savedPlaylists, "Playlist saved successfully")
        )
})

const removeFromSavedPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Playlist Id is invalid")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    // Get user
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    // Check if playlist is saved
    const isPlaylistSaved = user.savedPlaylists.some(
        id => id.toString() === playlistId
    )

    if (!isPlaylistSaved) {
        throw new ApiError(400, "Playlist is not saved")
    }

    // Remove playlist from saved list
    user.savedPlaylists = user.savedPlaylists.filter(
        id => id.toString() !== playlistId
    )
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, user.savedPlaylists, "Playlist removed from saved")
        )
})

const getSavedPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const user = await User.findById(userId).populate("savedPlaylists")
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Saved playlists fetched successfully")
        )
})

const addToWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isInWatchLater = user.watchLater?.some(
        id => id.toString() === videoId
    )

    if (isInWatchLater) {
        throw new ApiError(400, "Video is already in watch later")
    }

    user.watchLater.push(videoId)
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, user.watchLater, "Video added to watch later")
        )
})

const removeFromWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isInWatchLater = user.watchLater?.some(
        id => id.toString() === videoId
    )

    if (!isInWatchLater) {
        throw new ApiError(400, "Video is not in watch later")
    }

    user.watchLater = user.watchLater.filter(
        id => id.toString() !== videoId
    )
    await user.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, user.watchLater, "Video removed from watch later")
        )
})

const getWatchLaterVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const user = await User.findById(userId).select('watchLater')
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                _id: { $in: user.watchLater || [] }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        { $unwind: '$owner' },
        {
            $project: {
                _id: 1,
                title: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                videoFile: 1,
                owner: {
                    fullname: '$owner.fullname',
                    avatar: '$owner.avatar',
                    username: '$owner.username',
                    channelId: '$owner._id'
                }
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Watch later videos fetched successfully")
        )
})

const isVideoInWatchLater = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is invalid")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const isInWatchLater = await User.exists({
        _id: userId,
        watchLater: new mongoose.Types.ObjectId(videoId)
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { isInWatchLater: Boolean(isInWatchLater) },
                "Watch later status fetched successfully"
            )
        )
})

const getPublicPlaylist = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', search = '' } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const limitNum = Number(limit)

    const matchConditions = {
        isPrivate: false
    }

    if (search) {
        matchConditions.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ]
    }

    const rawPlaylists = await Playlist.aggregate([
        { $match: matchConditions },
        
        // Lookup first video for thumbnail
        {
            $lookup: {
                from: 'videos',
                let: { firstVideoId: { $arrayElemAt: ['$videos', 0] } },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$firstVideoId'] } } },
                    { $project: { thumbnail: 1, _id: 1 } }
                ],
                as: 'firstVideo'
            }
        },
        
        // Lookup owner details
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        { $unwind: { path: '$ownerDetails', preserveNullAndEmptyArrays: true } },
        
        // Add computed fields
        {
            $addFields: {
                videosCount: { $size: { $ifNull: ['$videos', []] } },
                thumbnail: {
                    $ifNull: [
                        { $arrayElemAt: ['$firstVideo.thumbnail', 0] },
                        null
                    ]
                },
                videoId: {
                    $ifNull: [
                        { $arrayElemAt: ['$firstVideo._id', 0] },
                        null
                    ]
                }
            }
        },
        
        {
            $project: {
                _id: 1,
                name: 1,
                thumbnail: 1,
                videoId: 1,
                videosCount: 1,
                createdAt: 1,
                isPrivate: 1,
                owner: '$owner',
                ownerFullname: '$ownerDetails.fullname',
                ownerUsername: '$ownerDetails.username'
            }
        },
        
        { $sort: { [sortBy]: -1 } },
        { $skip: skip },
        { $limit: limitNum }
    ])

    const playlists = rawPlaylists.map(playlist => ({
        _id: playlist._id,
        name: playlist.name,
        thumbnail: playlist.thumbnail,
        videoId: playlist.videoId,
        videosCount: playlist.videosCount,
        createdAt: playlist.createdAt,
        isPrivate: playlist.isPrivate,
        owner: playlist.owner,
        ownerFullname: playlist.ownerFullname,
        ownerUsername: playlist.ownerUsername
    }))

    const totalCount = await Playlist.countDocuments(matchConditions)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                playlists,
                pagination: {
                    currentPage: Number(page),
                    totalPages: Math.ceil(totalCount / limitNum),
                    totalPlaylists: totalCount,
                    hasMore: skip + playlists.length < totalCount
                }
            }, "Public playlists fetched successfully")
        )
})

const checkPlaylistSaved = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user._id

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const user = await User.findById(userId).select('savedPlaylists')
    
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isSaved = user.savedPlaylists?.some(
        id => id.toString() === playlistId
    ) || false

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isSaved }, "Playlist save status fetched")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    savePlaylist,
    removeFromSavedPlaylist,
    getSavedPlaylists,
    addToWatchLater,
    removeFromWatchLater,
    getWatchLaterVideos,
    isVideoInWatchLater,
    getAllPlaylists,
    getPublicPlaylist,
    checkPlaylistSaved
}
