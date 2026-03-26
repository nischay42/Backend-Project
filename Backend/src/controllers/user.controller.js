import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from 'jsonwebtoken';
import mongoose, { isValidObjectId } from 'mongoose';

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from fontend
    // validation - not empty
    // check if user already exists: username, email
    // check for image, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { fullname, email, username, password } = req.body;

    if (
        [fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedEmail = await User.findOne({ email })
    const existedUsername = await User.findOne({ username })

    if (existedEmail) {
        throw new ApiError(409, "User with email already exists");
    }
    if (existedUsername) {
        throw new ApiError(409, "User with username already exists");
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const refreshTokenoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000
    }

    const accessTokenoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000
    }


    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
    .status(201)
    .cookie("accessToken", accessToken, accessTokenoptions)
    .cookie("refreshToken", refreshToken, refreshTokenoptions)
    .json(
        new ApiResponse(201, { user: createdUser }, "User registered Successfully")
    )

})


const loginUser = asyncHandler(async (req, res) => {
    // req body —> data
    // username or email
    // find the user
    // password check
    // access and refresh token

    const {email, username, password} = req.body

    if (!(username || email)) {
        throw new ApiError(400,  "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPassworValid = await user.isPasswordCorrect(password)

    if (!isPassworValid) {
        throw new ApiError(401, "Invalid user credetials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const refreshTokenoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000
    }

    const accessTokenoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, accessTokenoptions)
    .cookie("refreshToken", refreshToken, refreshTokenoptions)
    .json(
        new ApiResponse(
            200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler( async (req, res) => {
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1 // this removes field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
         if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const refreshTokenoptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000 
        }

        const accessTokenoptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 2 * 24 * 60 * 60 * 1000
    }
    
        const { accessToken, refreshToken: newRereshToken } = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenoptions)
        .cookie("refreshToken", newRereshToken, refreshTokenoptions)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRereshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
}) 

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const {oldPassword, newPassword,  confirmPassword} = req.body

    if (!(newPassword === confirmPassword)) {
        throw new ApiError(400, "Invalid old password")
    }

    const user = await User.findById(userId)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, {user: req.user}, "currenct user fetched successfully"))
})

const updateAccrountDetails = asyncHandler(async (req, res) => {
    const {fullname, email, username} = req.body
    const userId = req.user?._id

    if(!fullname || !email || !username) {
        throw new ApiError(400, "All fields are required")
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const existingUser = await User.findOne({
        $and: [
            { _id: { $ne: userId } },
            { $or: [{ email }, { username }] }
        ]
    })

    if (existingUser) {
        if (existingUser.email === email) {
            throw new ApiError(409, 'Email is already taken')
        }
        if (existingUser.username === username) {
            throw new ApiError(409, 'Username is already taken')
        }
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { fullname, email, username }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatarPreUrl = await User.findById(userId).select("avatar")
    
    // delete old url
    if (avatarPreUrl?.avatar) {
        await deleteFromCloudinary(avatarPreUrl.avatar, 'image')
    }
   
    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if (!avatar.url) {
        throw new ApiError(400, "Error while uloading on avatar")
    }

    // update new url in db
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

     return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    if (!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage file is missing")
    }

    const coverImagePreUrl = await User.findById(userId).select('coverImage')

    // delete old url
    if (coverImagePreUrl.coverImage) {
        await deleteFromCloudinary(coverImagePreUrl.coverImage)
    }
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uloading on coverImage")
    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )
})


const getUserChannelProfile = asyncHandler(async (req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
             $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribers: {
                    $size: "$subscribers"
                },
                subscribed: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                avatar: 1,
                coverImage: 1,
                fullname: 1,
                username: 1,
                subscribed: 1,
                subscribers: 1,
                isSubscribed: 1,
                email: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(400, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )

})

const getWatchHistory = asyncHandler(async (req,  res) => {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "User Id is missing")
    }

    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner"
                        }
                    },
                    { $unwind: '$owner' },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            views: 1,
                            createdAt: 1,
                            duration: 1,
                            videoFile: 1,
                            _id: 1,
                            owner: {
                            fullname: "$owner.fullname",
                            avatar: "$owner.avatar",
                            username: "$owner.username",
                            channelId: "$owner._id"
                          }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccrountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
}