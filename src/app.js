import express from "express";

const app = express();

app.use(express.json());

// endpoints
app.get("/", (req, res) => {
    res.json({ message: "Start of project" });
});

export default app;