import crypto from 'crypto'
import otpModel from '../models/otp.model.js'
import { sendEmail } from '../services/email.resend.service.js'
import { generateOtp, getOtpHtml } from '../utils/utils.js'

export async function issueOtp(user) {
    await otpModel.deleteMany({ user: user._id })

    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = crypto.createHash("sha256").update(otp).digest('hex');
    await otpModel.create({
        email: user.email,
        user: user._id,
        otpHash
    })
    await sendEmail(user.email, "OTP Verification", html)

}