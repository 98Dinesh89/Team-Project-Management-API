import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createTask } from "../contorollers/task.controller.js";

const router = express.Router();

router.post("/:projectId", protectRoute, createTask);

export default router;