import express from "express";
import { projectMember, protectRoute } from "../middlewares/auth.middleware.js";
import { createTask, getTasks } from "../contorollers/task.controller.js";

const router = express.Router();

router.post("/:projectId", protectRoute, projectMember, createTask);
router.get("/:projectId", protectRoute, projectMember, getTasks);

export default router;