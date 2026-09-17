import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createTask, getTasks } from "../contorollers/task.controller.js";

const router = express.Router();

router.post("/:projectId", protectRoute, createTask);
router.get("/:projectId", protectRoute, getTasks);

export default router;