import express from "express";
import { projectMember, protectRoute, taskMember } from "../middlewares/auth.middleware.js";
import { createTask, deleteTasks, getTasks, patchTasks } from "../contorollers/task.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(rateLimiter);
router.use(protectRoute);

router.post("/:projectId", projectMember, createTask);
router.get("/:projectId", projectMember, getTasks);
router.patch("/:taskId", taskMember, patchTasks);
router.delete("/:taskId", taskMember, deleteTasks);

export default router;