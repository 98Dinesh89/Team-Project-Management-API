import express from "express";
import { protectRoute, teamMember } from "../middlewares/auth.middleware.js";
import { createProject, getProjects } from "../contorollers/project.controller.js";

const router = express.Router();

router.post("/:teamId", protectRoute, teamMember, createProject);
router.get("/:teamId", protectRoute, teamMember, getProjects);

export default router;