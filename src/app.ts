import trialRouter from "./routes/trial_routes";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import express from "express";
import cors from "cors"

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (_req, res) => {
    res.send("Works!");
});

app.use("/trial", trialRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

export default app
