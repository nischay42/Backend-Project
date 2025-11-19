import mongoose, {Schema} from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.ObjectId,
            ref: "Video"
        },
        owner: {
            type: Schema.ObjectId,
            ref: "User",
            required: true
        },
        comment: {
            type: Schema.ObjectId,
            ref: "Comment"
        },
        tweet: {
            type: Schema.ObjectId,
            ref: "Tweet"
        },
        reactionType: {
           type: String,
           enum: ["like", "dislike"],
           required: true
        }
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like",  likeSchema)