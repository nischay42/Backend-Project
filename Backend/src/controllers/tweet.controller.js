import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    
    const { content } = req.body
    const ownerId = req.user._id

    if (!content) {
        throw new ApiError(400, "content not found")
    }

    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, "Owner Id is missing")
    }

    await Tweet.create({
        content: content,
        owner: ownerId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet created successfully")
        )
})

const  getUserTweets = asyncHandler(async (req, res) => {
    
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is missing")
    }

    const tweets = await Tweet.find({
        owner: channelId
    })
    .populate('owner', 'fullname avatar')
    .sort({ createdAt: -1 })
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, {count: tweets.length, tweets}, "User tweets fetched successfully")
        )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body
    const userId = req.user._id

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID")
    }

    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet content is required")
    }

    const trimmedContent = content.trim()

    if (trimmedContent.length > 280) {
        throw new ApiError(400, "Tweet cannot exceed 280 characters")
    }

    const updatedTweet = await Tweet.findOneAndUpdate(
        {
            _id: tweetId,
            owner: userId 
        },
        {
            $set: { content: trimmedContent }
        },
        {
            new: true 
        }
    )

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found or you don't have permission to update it")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedTweet, "Tweet updated successfully")
        )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Tweet Id is missing")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const tweet = await Tweet.findById(tweetId)
    
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    if (tweet.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this tweet")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Tweet deleted successfully")
        )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}