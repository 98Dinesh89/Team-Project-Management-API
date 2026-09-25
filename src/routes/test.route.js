import express from "express";

import { atomicTaskUpdate, nonAtomicTaskUpdate } from "../contorollers/test.controller.js";
import { protectRoute, projectMember } from "../middlewares/auth.middleware.js";

const router = express.Router();

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