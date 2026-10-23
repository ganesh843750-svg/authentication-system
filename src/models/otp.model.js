import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    otpHash: {
        type: String,
        required: [true, "OTP hash is required"]
    },
    expiresAt: {
        type: Date,
        default: Date.now() + 1000 * 60 * 5, // 5 minutes
        required: [true, "Expiration date is required"]
    }
}, {
    timestamps: true
})
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
const otpModel = mongoose.model('otps', otpSchema)

export default otpModel;
