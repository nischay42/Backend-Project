import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is required");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const alreadySubscribed = await Subscription.findOne({ subscriber: userId, channel: channelId })

    if (alreadySubscribed) {
        await alreadySubscribed.deleteOne()
        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, "Channel unsubscribed")
            )
    }

    await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Channel subscribed")
        )

})

// controller to reutnr subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is required")
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate({ path: "subscriber" })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { count: subscribers.length }, "subscribers")
        )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Channel Id is required")
    }

    const subscribedChannel = await Subscription.find({
        subscriber: subscriberId
    }).populate({ path: "channel" })

    return res
        .status(200)
        .json(
            new ApiResponse(200, { count: subscribedChannel.length }, "subscribed channel")
        )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}