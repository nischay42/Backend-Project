import { Router } from "express";
import { 
    getChannelStats,
    getChannelVideosStats,
    getChannelVideo
} from '../controllers/dashboard.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/c/stats").get(verifyJWT, getChannelStats)
router.route("/v/stats").get(verifyJWT, getChannelVideosStats)
router.route("/v/:owner").get(getChannelVideo)

export default router