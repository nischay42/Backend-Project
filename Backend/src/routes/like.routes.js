import { Router } from "express";
import { 
    getLikedVideos,
    toggleCommentsLike,
    toggleVideoLike,
    toggleTweenLike,
    getVideoLikes,
    getCommentsLikes,
    getTweetLikes
 } from "../controllers/like.controller.js";
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/v/:videoId').get(optionalVerifyJWT, getVideoLikes)
router.route('/c/:commentId').get(optionalVerifyJWT, getCommentsLikes)
router.route('/t/:tweetId').get(optionalVerifyJWT, getTweetLikes)

router.use(verifyJWT)

router.route("/v/:videoId/:type").post(toggleVideoLike)
router.route("/c/:commentId/:type").post(toggleCommentsLike)
router.route("/t/:tweetId/:type").post(toggleTweenLike)
router.route("/videos").post(getLikedVideos)

export default router