import express from "express";
import { addMember, createTeam, getTeams } from "../contorollers/team.controller.js";
import { protectRoute, teamOwner } from "../middlewares/auth.middleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(rateLimiter);
router.use(protectRoute);

router.post("/", createTeam);
router.get("/", getTeams);
router.post("/:teamId", teamOwner, addMember);

export default router;