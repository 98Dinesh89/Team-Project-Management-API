import redisClient from "../config/redis.js";

const windowSeconds = 60;
const maxRequests = 5;

const rateLimitScript = `
    local count = redis.call("INCR", KEYS[1])

    if count == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
    end

    return count
`;

export const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const key = `rate:ip:${ip}`;

        const count = await redisClient.eval(
            rateLimitScript,
            {
                keys: [key],
                arguments: [windowSeconds.toString()]
            }
        );

        if (count > maxRequests) {
            return res.status(429).json({
                message: "Too many requests, try again later."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};