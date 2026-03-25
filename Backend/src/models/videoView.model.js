// models/videoView.model.js
import mongoose from 'mongoose'

const videoViewSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
        index: true
    },
    ip: {
        type: String,
        default: null,
        index: true
    },
    totalWatchTime: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
        expires: 2592000 // 30 days
    }
}, {
    timestamps: false
})

videoViewSchema.index({ video: 1, user: 1, createdAt: 1 })
videoViewSchema.index({ video: 1, ip: 1, createdAt: 1 })

export const VideoView = mongoose.model('VideoView', videoViewSchema)