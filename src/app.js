import express from "express";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(express.json());

// endpoints
app.use("/api/auth", authRoutes);

export default app;