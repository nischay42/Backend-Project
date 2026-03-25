import mongoose, { isValidObjectId } from "mongoose"
import { Like } from '../models/like.model.js'
import { ApiError } from '../utils/apiError.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'


const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId, type } = req.params
    const userId = req.user?._id
    
    if (!isValidObjectId(videoId) || !type) {
        throw new ApiError(400, "video Id or type is missing")
    }

    const existingReaction = await Like.findOne({ video: videoId, owner: userId })

    if (existingReaction) {
        if (existingReaction.reactionType === type) {
             // If same reaction clicked again → remove it (unlike/undislike)
            await existingReaction.deleteOne()
            return res
                .status(200)
                .json(
                    new ApiResponse(200, {}, `${type} removed`)
                )
        } else {
            // If switching from like→dislike or dislike→like
            existingReaction.reactionType = type
            await existingReaction.save()
            return res
               .status(200)
               .json(
                   new ApiResponse(200, {}, `Switched to ${type}`)
               )
        }
    }

    await Like.create({
        video: videoId,
        owner: userId,
        reactionType: type
    })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, `${type} added`)
        )
})

const toggleCommentsLike = asyncHandler(async (req, res) => {
    const { commentId, type } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId) || !type) {
        throw new ApiError(400, "comment Id or type is missing")
    }

    const existingReaction = await Like.findOne({ comment: commentId, owner: userId})

    if (existingReaction) {
        if (existingReaction.reactionType === type) {
             // If same reaction clicked again → remove it (unlike/undislike)
            await existingReaction.deleteOne()
            return res
                .status(200)
                .json(
                    new ApiResponse(200, {}, `${type} removed`)
                )
        } else {
            // If switching from like→dislike or dislike→like
            existingReaction.reactionType = type
            await existingReaction.save()
            return res
               .status(200)
               .json(
                   new ApiResponse(200, {}, `Switched to ${type}`)
               )
        }
    }

    await Like.create({
        comment: commentId,
        owner: userId,
        reactionType: type
    })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, `${type} added`)
        )
    
})

const toggleTweenLike = asyncHandler(async (req, res) => {
    const { tweetId, type } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(userId) || !type) {
        throw new ApiError(400, "User Id is missing for tweet")
    }

    const existingReaction = await Like.findOne({ tweet: tweetId, owner: userId})

    if (existingReaction) {
        if (existingReaction.reactionType === type) {
             // If same reaction clicked again → remove it (unlike/undislike)
            await existingReaction.deleteOne()
            return res
                .status(200)
                .json(
                    new ApiResponse(200, {}, `${type} removed`)
                )
        } else {
            // If switching from like→dislike or dislike→like
            existingReaction.reactionType = type
            await existingReaction.save()
            return res
               .status(200)
               .json(
                   new ApiResponse(200, {}, `Switched to ${type}`)
               )
        }
    }

    await Like.create({
        tweet: tweetId,
        owner: userId,
        reactionType: type
    })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, `${type} added`)
        )
    
    
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const reactions = await Like.find({
        owner: userId,
        reactionType: "like",
        video: { $exists: true, $ne: null}
    }).populate({
        path: "video",
        populate: { path: "owner", select: "avatar username fullname"}
    })
    
    const likedVideos = reactions
    .map(reac => reac.video)
    .filter(vide => vide !== null)
    
    const dislikedVideos = await Like.find({
        owner: userId,
        reactionType: "dislike",
        video: { $exists: true, $ne: null}
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {LikedCount: likedVideos.length, DisliedCount: dislikedVideos.length, likedVideos}, "All liked videos fetched")
        )
})

const getVideoLikes = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const likes = await Like.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $group: {
                _id: null,
                likesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'like'] }, 1, 0 ] }
                },
                dislikesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'dislike'] }, 1, 0] }
                },
                userReaction: {
                    $max: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: [userId ?? null, null] },
                                    {
                                        $eq: [
                                            '$owner',
                                            userId ? new mongoose.Types.ObjectId(userId) : null
                                        ]
                                    }
                                ]
                            },
                            then: '$reactionType',
                            else: null
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                likesCount: 1,
                dislikesCount: 1,
                userReaction: 1
            }
        }
    ])

    const result = likes[0] || {
        likesCount: 0,
        dislikesCount: 0,
        userReaction: null
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Video likes fetched")
        )
})


const getCommentsLikes = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const likes = await Like.aggregate([
        {
            $match: {
                comment: new mongoose.Types.ObjectId(commentId)
            }
        },
        {
            $group: {
                _id: null,
                likesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'like'] }, 1, 0 ] }
                },
                dislikesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'dislike'] }, 1, 0] }
                },
                userReaction: {
                    $max: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: [userId ?? null, null] },
                                    {
                                        $eq: [
                                            '$owner',
                                            userId ? new mongoose.Types.ObjectId(userId) : null
                                        ]
                                    }
                                ]
                            },
                            then: '$reactionType',
                            else: null
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                likesCount: 1,
                dislikesCount: 1,
                userReaction: 1
            }
        }
    ])

    const result = likes[0] || {
        likesCount: 0,
        dislikesCount: 0,
        userReaction: null
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Video likes fetched")
        )
})

const getTweetLikes = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid videoId")
    }

    const likes = await Like.aggregate([
        {
            $match: {
                tweet: new mongoose.Types.ObjectId(tweetId)
            }
        },
        {
            $group: {
                _id: null,
                likesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'like'] }, 1, 0 ] }
                },
                dislikesCount: {
                    $sum: { $cond: [{ $eq: ['$reactionType', 'dislike'] }, 1, 0] }
                },
                userReaction: {
                    $max: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: [userId ?? null, null] },
                                    {
                                        $eq: [
                                            '$owner',
                                            userId ? new mongoose.Types.ObjectId(userId) : null
                                        ]
                                    }
                                ]
                            },
                            then: '$reactionType',
                            else: null
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                likesCount: 1,
                dislikesCount: 1,
                userReaction: 1
            }
        }
    ])

    const result = likes[0] || {
        likesCount: 0,
        dislikesCount: 0,
        userReaction: null
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Video likes fetched")
        )
})

export {
    toggleCommentsLike,
    toggleTweenLike,
    toggleVideoLike,
    getLikedVideos,
    getVideoLikes,
    getCommentsLikes,
    getTweetLikes
}
