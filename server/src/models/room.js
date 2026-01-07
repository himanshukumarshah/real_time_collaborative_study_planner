import mongoose from "mongoose";

const { Schema } = mongoose;

const participantSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const roomSchema = mongoose.Schema(
    {
        _id: {
            type: String, 
            required: true,
        },
        roomName: {
            type: String,
            required: true,
            trim: true,
        },
        participants: {
            type: [participantSchema],
            default: [],
        },
        isSessionActive: {
            type: Boolean,
            default: false,
        },
        recentSessionStart: {
            type: Date,
        },
        duration: {
            type: Number,
            required: true,
            min: 0,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        roomStatus: {
            type: String,
            enum: ["waiting", "active", "ended"],
            default: "waiting",
        },
        sessionIds: {
            type: [Schema.Types.ObjectId],
            ref: "Session",
            default: [],
        }
    },
    {
        timestamps: true,
    },
);

const Room = mongoose.model("Room", roomSchema);
export default Room;