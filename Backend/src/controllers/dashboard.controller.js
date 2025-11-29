import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from '../models/subscription.model.js'
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total video, total likes etc.
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "user Id not found");
    }

    const stats = await User.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(userId)}
        },
        { // GET USER DETAILS (username, avatar)
            $project: {
                username: 1,
                avatar: 1
            }
        },
        { // LOOKUP VIDEOS CREATED BY USER
            $lookup: {
                from: "video",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        { // ADD VIDEO METADATA
            $addFields: {
                totalVideos: { $size: "$videos"},
                totalViews: { $size: "videos.views"},
                
            }
        },
        { // LOOKUP SUBSCRIBERS COUNT
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                totalSubscribers: { $size: "$subscribers"}
            }
        },
        { // FOR EACH VIDEO → count likes/dislikes
            $lookup: {
                from: "likes",
                let: { videoIds: "$videos._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $in: ["$video", "$$videoIds"]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$video",
                            likes: {
                                $sum: { $cond: [{ $eq: ["$reactionType", "like" ] }, 1, 0] }
                            },
                            dislikes: {
                                $sum: { $cond: [{ $eq: ["$reactionType", "dislike"] }, 1, 0] }
                            }
                        }
                    }
                ],
                as: "videoReactions"
            }
        },
        { // MERGE REACTION DATA WITH VIDEO LIST
            $addFields: {
                videos: {
                    $map: {
                        input: "$videos",
                        as: "vid",
                        in: {
                            _id: "$$vid._id",
                            title: "$$vid.title",
                            thumbnail: "$$vid.thumbnail",
                            createdAt: "$$vid.createdAt",
                            views: "$$vid.views",
                            likes: {
                                $let: {
                                    vars: {
                                        match: {
                                            $first: {
                                                $filter: {
                                                    input: "$videoReactions",
                                                    cond: { $seq: ["$$this._id", "$$vid._id"] }
                                                }
                                            }
                                        }
                                    },
                                    in: { $ifNull: ["$$match.likes", 0] }
                                }
                            },
                            dislikes: {
                                $let: {
                                    vars: {
                                        match: {
                                            $first: {
                                                $filter: {
                                                    inpout: "$videoReactions",
                                                    cond: { $eq: ["$$this._id", "$$vid._id"] }
                                                }
                                            }
                                        }
                                    },
                                    in: { $ifNull: ["$$match.dislikes", 0] }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                subscribers: 0,
                videoReactions: 0
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(200, stats[0], "Dashboard stats fetched successfully")
        )
})

const getChannelVideo = asyncHandler(async (req, res) => {

    const owner = req.user._id

    if (!isValidObjectId(owner)) {
        throw new ApiError(400, "owner not found");
    }

    const videos = await Video.find({ owner }).toSorted({ createdAt: -1});

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Video fetched successfully")
        )
})

export {
    getChannelStats,
    getChannelVideo
}