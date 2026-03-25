import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
    getChannelSubscribers
} from "../controllers/subscription.controller.js"
import { verifyJWT, optionalVerifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.route("/s/:channelId").get(optionalVerifyJWT, getChannelSubscribers)
router.route("/u/:channelId").get(optionalVerifyJWT, getUserChannelSubscribers)
router.route("/subscribedChannels").get(verifyJWT, getSubscribedChannels)

router.route("/c/:channelId").post(verifyJWT, toggleSubscription);

export default router