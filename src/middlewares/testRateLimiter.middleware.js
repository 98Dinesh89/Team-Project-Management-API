const requests = new Map();
const windowMs = 60 * 1000;
const maxRequests = 5;

setInterval(() => {
    const now = Date.now();

    for (const [key, record] of requests) {
        if (now - record.startTime >= windowMs) {
            requests.delete(key);
        }
    }
    console.log("expired keys deleted!!");
}, windowMs);

export const testRateLimiter = (req, res, next) => {
    const key = req.ip;

    const now = Date.now();

    const record = requests.get(key);

    // First request from client
    if (!record) {
        requests.set(key, {
            count: 1,
            startTime: now
        });

        return next();
    }

    const elapsed = now - record.startTime;

    // window has expired -> start a new window
    if (elapsed >= windowMs) {
        requests.set(key, {
            count: 1,
            startTime: now
        });

        return next();
    }

    // Limit exceed
    if (record.count >= maxRequests) {
        return res.status(429).json({
            message: "Too many requests, try again later."
        });
    }

    // Request is allowed
    record.count++;

    next();
};