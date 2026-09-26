import { createClient } from "redis";
import { ENV } from "./env.js";

const redisClient = createClient({
    url: ENV.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (error) => {
    console.error("Redis error: ", error);
});

await redisClient.connect();
console.log("Redis connected successfully");

export default redisClient;