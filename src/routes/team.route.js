import express from "express";
import { addMember, createTeam, getTeams } from "../contorollers/team.controller.js";
import { protectRoute, teamOwner } from "../middlewares/auth.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import { addMemberSchema, createTeamSchema } from "../validators/team.validator.js";

const router = express.Router();
router.use(rateLimiter);
router.use(protectRoute);

router.post("/", validator(createTeamSchema), createTeam);
router.get("/", getTeams);
router.post("/:teamId", teamOwner, validator(addMemberSchema), addMember);

export default router;