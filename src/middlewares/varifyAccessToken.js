import jwt from "jsonwebtoken"
import config from "../config/config.js"

export function verifyAccessToken(req, resp, next) {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return resp.status(401).json({ message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return resp.status(401).json({ message: "AccessToken expired" })
        }
        return resp.status(401).json({ message: "Invalid token" })
    }
}