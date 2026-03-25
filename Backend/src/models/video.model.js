import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // cloudinary url
            required: true
        },
        thumbnail: {
            type: String, // cloudinary url
            required: true
        },
        title: {
            type: String, 
            required: true,
        },
        description: {
            type: String, 
            required: true,
        },
        duration: {
            type: String, 
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        category: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
})


// CREATE TEXT INDEX - This is REQUIRED for $text search
videoSchema.index({ 
    title: 'text', 
    description: 'text' 
}, {
    weights: {
        title: 10,
        description: 5
    },
    name: 'video_text_index' // Give it a name for easy reference
});

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)