import userModel from "../models/user.model.js";
import crypto from 'crypto'
import bcrypt from "bcrypt"
import config from "../config/config.js";
import jwt from "jsonwebtoken"
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { issueOtp } from "../services/otp.service.js";
export async function register(req, resp) {
    try {
        const { username, email, password } = req.body;
        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if (isAlreadyRegistered) {
            return resp.status(409).json({
                message: "Username or email already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
        })
        await issueOtp(user);
        resp.status(201).json({
            message: "User registerd sucessfully",
            user: {
                username: user.username,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        resp.status(500).json({
            message: "Internal server error"
        })
    }

}


export async function login(req, resp) {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return resp.status(401).json({
                message: "Invalid email or password"
            })
        }

        if (!user.verified) {
            return resp.status(401).json({
                message: "Please verify your email before logging in"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return resp.status(401).json({
                message: "Invalid email or password"
            })
        }


        const refreshToken = generateRefreshToken(user._id);
        const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest('hex');
        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHashed,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        })

        const accessToken = generateAccessToken(user._id)

        resp.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        resp.status(200).json({
            message: "User logged in successfully",
            user: {
                username: user.username,
                email: user.email
            },
            accessToken
        })
    } catch (err) {
        resp.status(500).json({ message: "Login failed" })
    }
}



export async function getMe(req, resp) {
    try {
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return resp.status(404).json({
                message: "User not found"
            })
        }
        resp.status(200).json({
            message: "User fetched successfully",
            user: {
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        resp.status(500).json({
            message: "Internal server error"
        })
    }
}


export async function refreshToken(req, resp) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return resp.status(401).json({
                message: "Refresh token not found"
            })
        }
        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
        const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest('hex');
        const session = await sessionModel.findOne({
            refreshTokenHashed,
            revoked: false
        })

        if (!session) {
            return resp.status(401).json({
                message: "Session not found"
            })
        }
        const accessToken = generateAccessToken(decoded.id)
        const newRefreshToken = generateRefreshToken(decoded.id);
        const newRefreshTokenHashed = crypto.createHash("sha256").update(newRefreshToken).digest('hex');
        session.refreshTokenHashed = newRefreshTokenHashed;
        await session.save()
        resp.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000// 7days
        }
        )
        resp.status(200).json({
            message: "AcessToken refreshed sucessfully",
            accessToken
        })
    } catch (err) {
        resp.status(500).json({ message: "Refresh failed" })
    }
}


export async function logout(req, resp) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return resp.status(401).json({
                message: "Refresh token not found"
            })
        }
        const refreshTokenHashed = crypto.createHash("sha256").update(refreshToken).digest('hex');
        const session = await sessionModel.findOne({
            refreshTokenHashed,
            revoked: false
        })
        if (!session) {
            return resp.status(401).json({
                message: "Session not found"
            })
        }
        session.revoked = true;
        await session.save()

        resp.clearCookie("refreshToken")

        resp.status(200).json({
            message: "User logged out successfully"
        })
    } catch (err) {
        resp.status(500).json(
            { message: "Logout failed" }
        )
    }
}



export async function logoutAll(req, resp) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return resp.status(401).json({
                message: "Refresh token not found"
            })
        }
        const decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET)
        const sessions = await sessionModel.updateMany({
            user: decoded.id,
            revoked: false
        }, {
            revoked: true
        })
        resp.clearCookie("refreshToken")
        resp.status(200).json({
            message: "User logged out from all devices successfully"
        })
    } catch (err) {
        resp.status(500).json({ message: "User logged out from all devices failed" })
    }
}


export async function verifyEmail(req, resp) {
    try {
        const { email, otp } = req.body;
        const otpHash = crypto.createHash("sha256").update(otp).digest('hex');
        const otpRecord = await otpModel.findOne({
            email,
            otpHash
        })
        if (!otpRecord) {
            return resp.status(400).json({
                message: "Invalid OTP"
            })
        }
        if (otpRecord.expiresAt < Date.now()) {
            await otpModel.deleteOne({
                _id: otpRecord._id
            })
            return resp.status(400).json({
                message: "OTP has expired, please request a new one"
            })
        }
        const user = await userModel.findByIdAndUpdate(otpRecord.user, { verified: true }, { new: true })
        await otpModel.deleteOne({
            user: otpRecord.user
        })
        return resp.status(200).json({
            message: "Email verified successfully",
            user: {
                id: user._id,
                email: user.email,
                verified: user.verified
            }
        })
    } catch (err) {
        resp.status(500).json(
            { message: "Email verification failed" }
        )
    }

}


export async function resendOtp(req, resp) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return resp.status(404).json({ message: "User not found" })
        }
        if (user.verified) {
            return resp.status(400).json({ message: "Email is already verified" })
        }
        await issueOtp(user);
        return resp.status(200).json({ message: "OTP sent successfully" })
    } catch (err) {
        console.log(err)
        resp.status(500).json({ message: "Failed to resend OTP" })
    }
}