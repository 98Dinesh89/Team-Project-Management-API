import express from "express";
import { register } from "../contorollers/auth.controller.js";

const router = express.Router();

router.use("/register", register);

export default router;