import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from '../models/subscription.model.js'
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400,  'User Id not found')
    }
    const [videoStats, subscriberCount] = await Promise.all([
        Video.aggregate([
            {
                $match: { owner: new mongoose.Types.ObjectId(userId)}
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'video',
                    as: 'reactions'
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalLikes: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$reactions',
                                    cond: { $eq: ['$$this.reactionType', 'like']}
                                }
                            }
                        }
                    }
                }
            }
        ]),
        Subscription.countDocuments({ channel: userId })
    ])

    const stats = videoStats[0] || {
        totalViews: 0,
        totalLikes: 0
    }

   return res
        .status(200)
        .json(
            new ApiResponse(200, {...stats, totalSubscribers: subscriberCount }, "Dashboard stats fetched successfully")
        )
})

const getChannelVideosStats = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'User Id not found')
    }

    const skip = (Number(page) - 1) * Number(limit)

    const videos = await  Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId)}
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'video',
                as: 'reactions'
            }
        },
        {
            $addFields: {
                likesCount: {
                    $size: {
                        $filter: {
                            input: '$reactions',
                            cond: { $eq: ['$$this.reactionType', 'like']}
                        }
                    }
                },
                dislikesCount: {
                    $size: {
                        $filter: {
                            input: '$reactions',
                            cond: { $eq: ['$$this.reactionType', 'dislike']}
                        } 
                    }
                }
            }
        },            
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                likesCount: 1,
                dislikesCount: 1
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: Number(limit)}
    ])
    const totalVideos = await Video.countDocuments({
        owner: new mongoose.Types.ObjectId(userId)
    })

    return res
      .status(200)
      .json(
          new ApiResponse(200, {
            videos,
            pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalVideos / Number(limit)),
            totalVideos,
            hasMore: skip + videos.length < totalVideos
            }}, "Channel videos fetched successfully")
      )
})

const getChannelVideo = asyncHandler(async (req, res) => {

    const { owner } = req.params
    const sortType = req.query.sortType;

    if (!isValidObjectId(owner)) {
        throw new ApiError(400, "owner not found");
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(owner),
                isPublished: true
            }
        },
        {
            $sort: { createdAt: sortType === "asc" ? 1 : -1 || -1}
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
            title: 1,
            thumbnail: 1,
            views: 1,
            duration: 1,
            createdAt: 1,
            category: 1,
            videoFile: 1,
            owner: {
              fullname: "$owner.fullname",
              avatar: "$owner.avatar",
              username: "$owner.username"
              }
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Video fetched successfully")
        )
})

export {
    getChannelStats,
    getChannelVideosStats,
    getChannelVideo
}