import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProject } from "../contorollers/project.controller.js";

const router = express.Router();

router.post("/:teamId", protectRoute, createProject);

export default router;