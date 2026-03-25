import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
    savePlaylist,
    removeFromSavedPlaylist,
    getSavedPlaylists,
    addToWatchLater,
    removeFromWatchLater,
    getWatchLaterVideos,
    isVideoInWatchLater,
    getAllPlaylists,
    getPublicPlaylist,
    checkPlaylistSaved
} from "../controllers/playlist.controller.js"
import {verifyJWT, optionalVerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route('/public').get(optionalVerifyJWT, getPublicPlaylist)

router.use(verifyJWT)

router.route('/check-saved/:playlistId').get(checkPlaylistSaved)
router.route("/").post(createPlaylist)
router.route('/all').get(getAllPlaylists)
router.route("/saved").get(getSavedPlaylists)
router.route("/watch-later").get(getWatchLaterVideos)
router.route("/watch-later/check/:videoId").get(isVideoInWatchLater)
router.route("/watch-later/add/:videoId").patch(addToWatchLater)
router.route("/watch-later/remove/:videoId").patch(removeFromWatchLater)

router
    .route("/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/save/:playlistId").patch(savePlaylist)
router.route("/unsave/:playlistId").patch(removeFromSavedPlaylist)

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)

router.route("/user/:videoId").get(getUserPlaylists)

export default router
