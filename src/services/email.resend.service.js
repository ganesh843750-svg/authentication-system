import { Resend } from "resend";
import config from "../config/config.js";

export const resend = new Resend(config.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: html
        })
        if (error) {
            console.log("Error sending email:", error)
        }
        else {
            console.log("Email sent successfully:", data)
        }
    }
    catch (err) {
        console.log("Unexpected error:", err)
    }
}