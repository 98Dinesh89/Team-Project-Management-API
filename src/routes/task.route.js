import express from "express";
import { projectMember, protectRoute, taskMember } from "../middlewares/auth.middleware.js";
import { createTask, deleteTasks, getTasks, patchTasks } from "../contorollers/task.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { createTaskSchema, getTasksSchema, patchTaskSchema } from "../validators/task.validator.js";

const router = express.Router();
router.use(protectRoute);

router.post("/:projectId", projectMember, validator(createTaskSchema), createTask);
router.get("/:projectId", projectMember, validator(getTasksSchema, "query"), getTasks);
router.patch("/:taskId", taskMember, validator(patchTaskSchema), patchTasks);
router.delete("/:taskId", taskMember, deleteTasks);

export default router;