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
    const { channelId } = req.params
    const userId = req.user?._id

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is required")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                subscribersCount: { $sum: 1 },
                isSubscribed: {
                    $max: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne : [userId ?? null, null] },
                                    {
                                        $eq: [
                                            '$subscriber',
                                            userId ? new mongoose.Types.ObjectId(userId) : null
                                        ]
                                    }
                                ]
                            },
                            then: true,
                            else: false
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                subscribersCount: 1,
                isSubscribed: 1
            }
        }
    ])

    const result = subscribers[0] || { subscribersCount: 0 }

    // default false for everyone
    result.isChannelOwner = false
    
    if (userId) {
        result.isSubscribed = result.isSubscribed || false
        //  Override if user is logged in and is owner        
        result.isChannelOwner = channelId === userId.toString()
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Channel subscription fetched")
        )

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const  userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is required")
    }

    const subscriber= await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'channel',
                foreignField: '_id',
                as: 'channelDetails'
            }
        },
        {
            $unwind: '$channelDetails'
        },
        {
            $lookup: {
                from: 'videos',
                let: { channelId: '$channel' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$owner', '$$channelId'] },
                                    { $eq: ['$isPublished', true] }
                                ]
                            }
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 3 },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            thumbnail: 1,
                            views: 1,
                            duration: 1,
                            createdAt: 1,
                            category: 1,
                            videoFile: 1
                        }
                    }
                ],
                as: 'videos'
            }
        },
        {
            $project: {
                _id: '$channelDetails._id',
                subscriberId: '$channelDetails._id',
                username: '$channelDetails.username',
                fullname: '$channelDetails.fullname',
                avatar: '$channelDetails.avatar',
                videos: 1
            }
        }

    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, { count: subscriber.length, subscriber }, "subscribed channels")
        )
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    
    const { channelId } = req.params
    const userId = req.user?._id
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel Id is required")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        { // lookup subscriber details
            $lookup: {
                from: 'users',
                localField: 'subscriber',
                foreignField: '_id',
                as: 'subscriberDetails'
            }
        },
        { $unwind: '$subscriberDetails'},
        { // get subscriber's subscriber count
            $lookup: {
                from: 'subscriptions',
                localField: 'subscriber',
                foreignField: 'channel',
                as: 'subscriberCount'
            }
        },
        { // check if looged in user is subscribed to this subscriber
            $lookup: {
                from: 'subscriptions',
                let: { subscriberId: '$subscriber'},
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$channel', '$$subscriberId'] },
                                    { $eq: ['$subscriber', userId ? new mongoose.Types.ObjectId(userId) : null]}
                                ]
                            }
                        }
                    }
                ],
                as: 'isSubscribedToSubscriber'
            }
        },
        {
            $project: {
                _id: 0,
                subscriberId: '$subscriberDetails._id',
                fullname: '$subscriberDetails.fullname',
                username: '$subscriberDetails.username',
                avatar: '$subscriberDetails.avatar',
                subscribersCount: { $size: '$subscriberCount' },
                isSubscribed: {
                    $cond: {
                        if: { $gt: [{ $size: '$isSubscribedToSubscriber' }, 0] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $sort: { subscribersCount: -1 }
        }
    ])



    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            { 
                count: subscribers.length,
                subscribers
            }, 
            "Channel subscribers fetched successfully")
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getChannelSubscribers
}