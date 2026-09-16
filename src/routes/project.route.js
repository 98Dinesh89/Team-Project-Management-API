import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createProject, getProjects } from "../contorollers/project.controller.js";

const router = express.Router();

router.post("/:teamId", protectRoute, createProject);
router.get("/:teamId", protectRoute, getProjects);

export default router;