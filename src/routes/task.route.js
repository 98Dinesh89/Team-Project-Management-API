import express from "express";
import { projectMember, protectRoute, taskMember } from "../middlewares/auth.middleware.js";
import { createTask, deleteTasks, getTasks, patchTasks } from "../contorollers/task.controller.js";

const router = express.Router();

router.post("/:projectId", protectRoute, projectMember, createTask);
router.get("/:projectId", protectRoute, projectMember, getTasks);
router.patch("/:taskId", protectRoute, taskMember, patchTasks);
router.delete("/:taskId", protectRoute, taskMember, deleteTasks);

export default router;