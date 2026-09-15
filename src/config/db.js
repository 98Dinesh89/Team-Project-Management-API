import mongoose from "mongoose";
import { ENV } from "./env.js";

const connectDB = async () => {
    try {
        const MONGODB_URI = ENV.MONGODB_URI;
        if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

        const conn = await mongoose.connect(ENV.MONGODB_URI);
        console.log("MONGODB CONNECTED: ", conn.connection.host);
        console.log("-----------------------------------------------------------------------------------------------------------");

    } catch (error) {
        console.error("Error connecting to mongodb ", error);
        process.exit(1);
    }
}

export default connectDB;