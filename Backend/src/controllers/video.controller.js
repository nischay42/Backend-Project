import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import ffmpeg from 'fluent-ffmpeg'

const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy, sortType, userId, category } = req.query;
    
    page = parseInt(page)
    limit = parseInt(limit)

    // filter object

    const filter = {}

    // search by title or description
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i"}}
        ];
    }

    // filter by user who upload the video
    if (userId) {
        filter.owner = userId
    }

    // filter by category
    if (category) {
        filter.category = category
    }

    // build sort object

    const sortOrder = sortType === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortOrder }

    // pagination
    const skip = (page - 1) * limit

    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("owner", "username avatar")

    
    const totalVideos = await Video.countDocuments(filter)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {totalVideos, page, limit, totalPages: Math.ceil(totalVideos / limit), videos}, "Videos fetched successfully")
        )

});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, category, isPublished = true } = req.body;
    const owner = req.user._id

    const videoFilePath = req.files?.videoFile?.[0]?.path
    const thumbnailPath = req.files?.thumbnail?.[0]?.path

    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!title || !description || !category) {
        throw new ApiError(400, "Title, Description and Category are required")
    }

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }

    // Extract duration from video

    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)

        const formattedMins = mins < 10 ? `0${mins}` : mins
        const formattedSecs = secs < 10 ? `0${secs}` : secs

        return `${formattedMins}:${formattedSecs}`;
    }

    const rawDuration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoUrl, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration)
        })
    })

    const videoDuration = formatDuration(rawDuration)
    
    const video = await Video.create({
        title,
        description,
        owner,
        category,
        isPublished,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoDuration
    })

    return res
        .status(201)
        .json(
            new ApiResponse(201, video, "Video uploaded successfully")
        )
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    
    if (!videoId) {
        throw new ApiError(400, "Video Id is missing")
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username fullname avatar subscribers")

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description, isPublished, category } = req.body;
    
    if (!videoId) {
        throw new ApiError(400, "Video Id is missing")
    }

    const videoUpdate = await Video.findByIdAndUpdate(
        videoId,
        { $set:  updates },
        { new: true, runValidators: true }
    )

    const updates = {}

    if (typeof title !== 'undefined') updates.title = title
    if (typeof description !== 'undefined') updates.description = description
    if (typeof category !== 'undefined') updates.category = category
    if (typeof isPublished !== "undefined") updates.isPublished = isPublished;

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    if (thumbnailPath) {
        
        const uploadedThumb = await uploadOnCloudinary(thumbnailPath);
        await deleteFromCloudinary(video.thumbnail);

        if (uploadedThumb?.url) {
            updates.thumbnail = uploadedThumb.url;
        }
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, videoUpdate, "Video Details updated successfully")
        )
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id
    
    if (!videoId) {
        throw new ApiError(400, "Video Id is missing")
    }
    
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }


    const videoDeleted = await deleteFromCloudinary(video.videoFile)
    const thumbnailDeleted = await deleteFromCloudinary(video.thumbnail);

    if (!videoDeleted || !thumbnailDeleted) {
        throw new ApiError(500, "Failed to delete video files from Cloudinary");
    }
    
    await Video.findByIdAndDelete(videoId)
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video Deleted Successfully")
        )

});

const togglePublisherStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { toggleStatus } = req.body
    const userId = req.user._id

    if (!videoId) {
        throw new ApiError(400, "Video Id is missing");
    }

    if (typeof toggleStatus === "undefined") {
        throw new ApiError(400, "toggleStatus is required");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check ownership
    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You cannot change publish status of this video");
    }

    video.isPublished = toggleStatus;
    await video.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Publish status updated successfully")
        )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublisherStatus
}
