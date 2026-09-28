import express from "express";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import teamRoutes from "./routes/team.route.js";
import projectRoutes from "./routes/project.route.js";
import taskRoutes from "./routes/task.route.js";
import testRoutes from "./routes/test.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";
import helmet from "helmet";
import cors from "cors";
import { ENV } from "./config/env.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(rateLimiter);

// endpoints
app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/test", testRoutes);

// error handling
app.use(errorHandler);

export default app;