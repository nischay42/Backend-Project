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
    
    const ownerId = req.user._id

    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, "Owner Id is missing")
    }

    const tweets = await Tweet.find({
        owner: ownerId
    }).sort({ createdAt: -1 })

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

    if (!content || !isValidObjectId(tweetId)) {
      throw new ApiError(400, "Content or tweet Id is missing")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if ( tweet.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not allowed to edit this tweet")
   }

   const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $set: { content } },
    { new: true}
   )

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
      throw new ApiError(400, "tweet Id is missing")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const tweet =  await findById(tweetId)
    if (!tweet) {
      throw new ApiError(404, "tweet not found")
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