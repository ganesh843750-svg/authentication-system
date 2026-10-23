import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"
import { verifyAccessToken } from "../middlewares/varifyAccessToken.js";
const authRouter = Router();

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
authRouter.post("/verify-email", authController.verifyEmail)
authRouter.post("/resend-otp", authController.resendOtp)


authRouter.get("/get-me", verifyAccessToken, authController.getMe)
authRouter.get("/refresh-token", verifyAccessToken, authController.refreshToken)
authRouter.post("/logout", verifyAccessToken, authController.logout)
authRouter.get("/logout-all", verifyAccessToken, authController.logoutAll)


export default authRouter;