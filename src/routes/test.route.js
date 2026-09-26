import express from "express";

import { atomicTaskUpdate, nonAtomicTaskUpdate, rateLimitTest, redisTest } from "../contorollers/test.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { testRateLimiter } from "../middlewares/testRateLimiter.middleware.js";

const router = express.Router();


router.get("/redis", redisTest);
router.get(
    "/rate-limit",
    testRateLimiter,
    rateLimitTest
);
router.patch(
    "/non-atomic-update/:taskId",
    protectRoute,
    nonAtomicTaskUpdate
);
router.patch(
    "/atomic-update/:taskId",
    protectRoute,
    atomicTaskUpdate
);

export default router;