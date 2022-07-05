import businessUnitsRouter from "./routes/businessUnits";
import usersRouter from "./routes/users";
import infoRouter from "./routes/info";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Add headers before the routes are defined
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Routes
app.get("/", (_req, res) => {
    res.send("Works!");
});

// Should we add /users to users? Got to eliminate the from the route
app.use("/api/businessunits", businessUnitsRouter);
app.use("/api/info", infoRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

export default app;
