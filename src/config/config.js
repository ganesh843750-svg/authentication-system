import dotenv from 'dotenv'

dotenv.config()// to access the variables in the .env file


if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined in environment variables")
}
if(!process.env.ACCESS_TOKEN_SECRET){
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables")
}
if(!process.env.REFRESH_TOKEN_SECRET){
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables")
}
if(!process.env.RESEND_API_KEY){
    throw new Error("RESEND_API_KEY is not defined in environment variables")
}
if(!process.env.PORT){
    throw new Error("PORT is not defined in environment variables")
}
const config = {
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    PORT: process.env.PORT
}
export default config;

