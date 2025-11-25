import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user?._id

    if (!name || !description) {
        throw new ApiError(400, "Name and Description is required")
    }

    await Playlist.create({
        name: name,
        description: description,
        owner: userId
    })

   return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Playlist created successflly")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} =  req.params

    if (!userId) {
        throw new ApiError(400, "User Id is missing")
    }
    
    const userPlaylists = await Playlist.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        {
            $project: {
                name: 1,
                description: 1,
                video: 1,
                owner: 1
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, userPlaylists, "Playlistas fetched successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if (!playlistId) {
        throw new ApiError(400, "Playlist Id not found")
    }

    const playlist = await Playlist.findById(playlistId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist fetched successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user?._id

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id or video Id is missing")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
    }

    await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { video: videoId } },
        { new: true }
    )

    
    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video added to playlist")
        );
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const userId = req.user?._id

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist Id or videoId is missing")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: {video: videoId} }, // Remove video from the array
        { new: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Video removed from playlist")
        );

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const userId = req.user?._id

    if (!playlistId) {
        throw new ApiError(400, "playlist Id not found")
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to delete this playlist");
    }


    await Playlist.findByIdAndDelete(playlistId)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    const userId = req.user?._id

    if (!playlistId) {
        throw new ApiError(400, "Playlist Id not found")
    }

    const updates = {}
    if (typeof name !== "undefined") updates.name = name
    if (typeof description !== "undefined") updates.description = description

    if (Object.keys(updates).length === 0) {
        // Nothing to update
        throw new ApiError(400, "No fields provided to update");
    }

    // verify ownership before update
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    if (playlist.owner?.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not allowed to update this playlist");
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set:  updates },
        { new: true, runValidators: true }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
        )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}