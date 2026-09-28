import dotenv from "dotenv"

dotenv.config();

export const ENV = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    FRONTEND_URL: process.env.FRONTEND_URL,
}