import businessUnitsRouter from "./routes/businessUnits";
import collabRouter from "./routes/collabs";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import usersRouter from "./routes/users";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (_req, res) => {
    res.send("Works!");
});

// Should we add /users to users?
app.use("/api/businessunits", businessUnitsRouter);
app.use("/api/collabs", collabRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

export default app;
