import mongoose from "mongoose";
import { refreshToken } from "../controllers/auth.controller.js";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is requeired"]
    },
    refreshTokenHashed: {
        type: String,
        required: [true, "Refresh token hash is required"]
    },
    ip: {
        type: String,
        required: [true, "IP address is required"]
    },
    userAgent: {
        type: String,
        required: [true, "User agent is requeired"]
    },
    revoked: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        required: [true, "Expiration date is required"]
    }

}, {
    timestamps: true
})
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const sessionModel = mongoose.model('sessions', sessionSchema)

export default sessionModel;