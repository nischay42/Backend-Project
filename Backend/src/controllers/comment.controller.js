import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  
   const {videoId} = req.params
   const {page=1, limit=10} = req.query

   if (!isValidObjectId(videoId)) {
     throw new ApiError(400, "video Id is missing")
   }

   const video = await Video.findById(videoId)
   if (!video) {
      throw new ApiError(400, "Video not found")
   }

   const skip = (parseInt(page) - 1) * parseInt(limit);
   
   const comments = await Comment.aggregate([
     {
        $match: {
           video: new mongoose.Types.ObjectId(videoId)
        }
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
         $addFields: {
            isVideoOwner: {
               $eq: ["$owner._id", video.owner]
            }
         }
     },
     {
         $project: {
            createdAt: 1,
            content: 1,
            isVideoOwner: 1,
            _id: 1,
             owner: {
              fullname: "$owner.fullname",
              avatar: "$owner.avatar",
              username: "$owner.username",
            }
         }
      },
     {
         $sort: { createdAt: -1 }
     },
     {
         $facet: {
            paginatedComments: [
               { $skip: skip },
               { $limit: parseInt(limit) }
            ],
            totalCount: [
               { $count: "count"}
            ]
         }
     },
     
  ])
  const paginatedComments = comments?.[0]?.paginatedComments ?? []
  const totalComments = comments[0]?.totalCount?.[0]?.count || 0

  return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            {
               comments: paginatedComments,
               totalComments,
               totalPages: Math.ceil(totalComments / limit),
               page: Number(page),
               limit: Number(limit)
            },
            "Video commentes fetched successfully"
         )
      )
})

const addComment = asyncHandler(async (req, res) => {
   
   const { videoId } = req.params
   const { content } = req.body
   const userId = req.user?._id

   if(!isValidObjectId(videoId) || !content) {
      throw new ApiError(400, "Content or videoId missing")
   }

   const comment = await Comment.create({
      content,
      video: videoId,
      owner: userId
   })

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            comment,
            "Comment added successfully"
         )
      )
})

const updateComment = asyncHandler(async (req, res) => {
   
   const { commentId } = req.params
   const { content } = req.body

   if (!isValidObjectId(commentId) || !content) {
      throw new ApiError(400, "comment ID or content is missing")
   }

   const comment = await Comment.findById(commentId)

   if (!comment) {
      throw new ApiError(404, "Comment not found")
   }

   if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to edit this comment")
   }
   
   const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { content } },
      { new: true }
   )

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedComment, "Comment updated successfully")
      )

})

const deleteComment = asyncHandler(async (req, res) => {
   
   const { commentId } = req.params

   if (!isValidObjectId(commentId)) {
      throw new ApiError(400, "comment Id is missing")
   }

   const comment =  await findById(commentId)
   if (!comment) {
      throw new ApiError(404, "comment not found")
   }

   if (comment.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "You are not allowed to delete this comment")
   }

   await Comment.findByIdAndDelete(commentId)

   return res
      .status(200)
      .json(
         new ApiResponse(200, {}, "Comment deleted successfully")
      )
})

export {
   getVideoComments,
   addComment,
   updateComment,
   deleteComment
}