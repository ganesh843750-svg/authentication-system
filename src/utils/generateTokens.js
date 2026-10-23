import jwt from "jsonwebtoken"
import config from "../config/config.js";
export const generateAccessToken = (userID) => {
    return jwt.sign(
        { id: userID},
         config.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m' }
        )
}

export const generateRefreshToken = (userID) =>{
    return jwt.sign(
        {id: userID},
        config.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
}