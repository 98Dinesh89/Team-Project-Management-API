import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import teamRoutes from "./routes/team.route.js";
import projectRoutes from "./routes/project.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

// endpoints
app.use("/api/project", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);

export default app;