import mongoose from "mongoose";

const { Schema } = mongoose;

const sessionSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      ref: "Room",
      required: true,
      index: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "abandoned"],
      default: "completed",
    },

    // metadata: e.g., session type, tags
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

sessionSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;     
        return ret;
    }
});

// Compound indexes for common queries
sessionSchema.index({ userId: 1, startTime: -1 });
sessionSchema.index({ roomId: 1, startTime: -1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;