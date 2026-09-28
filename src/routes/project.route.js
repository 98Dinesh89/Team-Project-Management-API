import express from "express";
import { protectRoute, teamMember } from "../middlewares/auth.middleware.js";
import { createProject, getProjects } from "../contorollers/project.controller.js";
import { createProjectSchema } from "../validators/project.validator.js";
import { validator } from "../middlewares/validator.middleware.js";

const router = express.Router();
router.use(protectRoute);

router.post("/:teamId", teamMember, validator(createProjectSchema), createProject);
router.get("/:teamId", teamMember, getProjects);

export default router;