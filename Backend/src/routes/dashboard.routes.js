import { Router } from "express";
import { 
    getChannelStats,
    getChannelVideo
} from '../controllers/dashboard.controller.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/stats").get(verifyJWT, getChannelStats)
router.route("/v/:owner").get(getChannelVideo)

export default router