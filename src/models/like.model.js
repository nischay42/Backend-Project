import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.ObjectId,
            ref: "User"
        },
        comment: {
            type: Schema.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.ObjectId,
            ref: "Tweet"
        },
        likedBy: {
            type: Schema.ObjectId,
            ref: "User"
        },
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like",  likeSchema)