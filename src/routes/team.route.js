import express from "express";
import { createTeam, getTeams } from "../contorollers/team.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createTeam);
router.get("/", protectRoute, getTeams);

export default router;