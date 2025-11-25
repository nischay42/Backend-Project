import { Router } from "express";
import { 
    getLikedVideos,
    toggleCommentsLike,
    toggleVideoLike,
    toggleTweenLike
 } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.route("/v/:videoId/:type").post(verifyJWT, toggleVideoLike)
router.route("/c/:commentId/:type").post(verifyJWT, toggleCommentsLike)
router.route("/t/:tweetId/:type").post(verifyJWT, toggleTweenLike)
router.route("/videos").post(verifyJWT, getLikedVideos)

export default router