import express from "express";
import { login, logout, register } from "../contorollers/auth.controller.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validator } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.post("/register", validator(registerSchema), register);
router.post("/login", validator(loginSchema), login);
router.post("/logout", logout);

export default router;