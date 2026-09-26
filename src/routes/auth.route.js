import express from "express";
import { login, logout, register } from "../contorollers/auth.controller.js";
import { rateLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();
router.use(rateLimiter);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;