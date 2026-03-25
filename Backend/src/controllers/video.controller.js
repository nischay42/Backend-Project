import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { VideoView } from "../models/videoView.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';


const getAllVideos = asyncHandler(async (req, res) => {
    const { 
        category, 
        limit = 12, 
        page = 1,
        random = 'false',
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = ''
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const limitNum = Number(limit);

    const matchConditions = {
        isPublished: true
    };

    // Category filter
    if (category && category !== "All") {
        matchConditions.category = category;
    }

    const pipeline = [];

    // MongoDB text search
    if (search && search.trim() !== '') {
        pipeline.push({
            $match: {
                $text: { $search: search },
                ...matchConditions
            }
        });
        
        // Add text score for relevance sorting
        pipeline.push({
            $addFields: {
                score: { $meta: "textScore" }
            }
        });
    } else {
        pipeline.push({ $match: matchConditions });
    }

    // Random sampling - ONLY for page 1 when random=true AND no search
    if (random === 'true' && Number(page) === 1 && !search) {
        pipeline.push({ $sample: { size: limitNum } });
    }

    pipeline.push(
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1,
                duration: 1,
                videoFile: 1,
                category: 1,
                description: 1,
                _id: 1,
                score: 1, // Include text search score
                owner: {
                    fullname: "$owner.fullname",
                    avatar: "$owner.avatar",
                    username: "$owner.username",
                    channelId: "$owner._id"
                }
            }
        }
    );

    // Sorting and pagination
    if ((random !== 'true' || Number(page) > 1) || search) {
        let sortCriteria;
        
        if (search) {
            // Sort by relevance first, then by views
            sortCriteria = { score: -1, views: -1 };
        } else {
            sortCriteria = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        }
        
        pipeline.push(
            { $sort: sortCriteria },
            { $skip: skip },
            { $limit: limitNum + 1 }
        );
    }

    const videos = await Video.aggregate(pipeline);
    
    // Check hasMore
    const hasMore = (random === 'true' && Number(page) === 1 && !search)
        ? true
        : videos.length > limitNum;
    
    if (hasMore && (random !== 'true' || search)) {
        videos.pop();
    }

    return res.status(200).json( 
        new ApiResponse(200, {
            videos,
            hasMore,
            currentPage: Number(page),
            totalResults: videos.length,
            isRandom: random === 'true' && Number(page) === 1 && !search,
            searchQuery: search || null
        }, search ? `Found ${videos.length} results for "${search}"` : "Videos fetched successfully")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, category, isPublished = false } = req.body;
    const owner = req.user._id

    if (!owner || !isValidObjectId(owner)) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!title || !description || !category) {
        throw new ApiError(400, "Title, Description and Category are required")
    }

    const videoFilePath = req.files?.videoFile?.[0]?.path
    const thumbnailPath = req.files?.thumbnail?.[0]?.path

    if (!videoFilePath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "Thumbnail is required");
    }
    
    ffmpeg.setFfmpegPath(ffmpegStatic)
    ffmpeg.setFfprobePath(ffprobeStatic.path)

    // Extract duration from video
    const rawDuration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration)
        })
    })
    
    function formatDuration(seconds) {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        
        const formattedMins = mins < 10 ? `0${mins}` : mins
        const formattedSecs = secs < 10 ? `0${secs}` : secs

        return `${formattedMins}:${formattedSecs}`;
    }


    const videoDuration = formatDuration(rawDuration)
    
    const videoFile = await uploadOnCloudinary(videoFilePath)
    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!videoFile?.url || !thumbnail?.url) {
        throw new ApiError(500, "Cloudinary upload failed");
    }

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
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is missing")
    }

    const video = await Video.findById(videoId)
        .populate("owner", "username fullname avatar");

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
    
    if (!isValidObjectId(videoId)) {
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
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is missing")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }
    
    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }


    const videoDeleted = await deleteFromCloudinary(video.videoFile, 'video')
    const thumbnailDeleted = await deleteFromCloudinary(video.thumbnail, 'image');

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
    
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Video Id is missing");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    if (typeof toggleStatus === "undefined") {
        throw new ApiError(400, "toggleStatus is required");
    }

    const video = await Video.findOneAndUpdate(
        {
            _id: videoId,
            owner: userId
        },
        {
            isPublished: toggleStatus
        },
        {
            new: true,
            runValidators: false
        }
    );

    if (!video) {
        throw new ApiError(404, "Video not found or you don't have permission");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, { isPublished: video.isPublished  }, "Publish status updated successfully")
        )
})

const addVideoView = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { watchDuration } = req.body 
    const userId = req.user?._id
    
    const ip = (
        req.headers['x-forwarded-for']?.split(',')[0] || 
        req.socket.remoteAddress
    )?.trim()

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, 'Invalid video ID')
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, 'Video not found')
    }


    const minimumWatchTime = 5 // seconds
    
    if (watchDuration && watchDuration < minimumWatchTime) {
        return res.status(200).json(
            new ApiResponse(200, { 
                viewCounted: false,
                message: `Must watch at least ${minimumWatchTime} seconds`
            }, 'Insufficient watch time')
        )
    }

    const now = new Date()
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000)

    try {
        const filter = {
            video: videoId,
            createdAt: { $gte: last24Hours }
        }

        if (userId) {
            filter.user = userId
        } else {
            filter.ip = ip
            filter.user = null
        }

        const existingView = await VideoView.findOne(filter)

        if (existingView) {
            // Update watch duration if watching again
            if (watchDuration) {
                existingView.totalWatchTime = (existingView.totalWatchTime || 0) + watchDuration
                await existingView.save()
            }

            return res.status(200).json(
                new ApiResponse(200, { 
                    viewCounted: false,
                    message: 'View already counted'
                }, 'View already counted')
            )
        }

        // Create new view
        await VideoView.create({
            video: videoId,
            user: userId || null,
            ip: userId ? null : ip,
            totalWatchTime: watchDuration || 0,
            createdAt: now
        })

        // Increment view count
        await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } }
        )

        // Add to watch history
        if (userId) {
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { watchHistory: videoId } }
            )
        }

        return res.status(200).json(
            new ApiResponse(200, { 
                viewCounted: true,
                totalViews: video.views + 1
            }, 'View counted successfully')
        )

    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json(
                new ApiResponse(200, { viewCounted: false }, 'View already counted')
            )
        }
        throw error
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublisherStatus,
    addVideoView
}
