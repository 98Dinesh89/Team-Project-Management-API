import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export const generateToken = (userId, res) => {
    const JWT_SECRET = ENV.JWT_SECRET;
    if (!JWT_SECRET) throw new Error("JWT_SECRET not configured");

    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
}