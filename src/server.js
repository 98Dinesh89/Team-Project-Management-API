import app from "./app.js";
import connectDB from "./config/db.js";
import { ENV } from "./config/env.js";

const PORT = ENV.PORT || 6767;

const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`In ${ENV.NODE_ENV} phase!!`);
            connectDB();
        });
    } catch (error) {
        console.error("Server not started. ", error);
    }
}

startServer();