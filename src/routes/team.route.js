import express from "express";
import { addMember, createTeam, getTeams } from "../contorollers/team.controller.js";
import { protectRoute, teamOwner } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createTeam);
router.get("/", protectRoute, getTeams);
router.post("/:teamId", protectRoute, teamOwner, addMember);

export default router;