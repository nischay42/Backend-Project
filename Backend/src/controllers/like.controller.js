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

    const existingReaction = await Like.findOne({ video: videoId, user: userId})

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

    const existingReaction = await Like.findOne({ comment: commentId, user: userId})

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

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing for tweet")
    }

    const existingReaction = await Like.findOne({ tweet: tweetId, user: userId})

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
        user: userId,
        reactionType: "like",
        video: { $exists: true, $ne: null}
    }).populate({
        path: "video",
        populate: { path: "owner", select: "username fullname"}
    })

    const likedVideos = reactions
    .map(reac => reac.video)
    .filter(vide => vide !== null)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {count: likedVideos.length, likedVideos}, "All liked videos fetched")
        )

})





export {
    toggleCommentsLike,
    toggleTweenLike,
    toggleVideoLike,
    getLikedVideos
}
