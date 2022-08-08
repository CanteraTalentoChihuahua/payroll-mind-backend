import businessUnitsRouter from "./routes/businessUnits";
import indicatorsRouter from "./routes/indicators";
import payrollRouter from "./routes/payroll";
import outcomeRouter from "./routes/outcomes";
import incomeRouter from "./routes/incomes";
import usersRouter from "./routes/users";
import infoRouter from "./routes/info";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import express from "express";
import cors from "cors";

import multer from "multer";
import fs from "fs";
import os from "os";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (_req, res) => {
    res.send("Works!");
});

// Should we add /users to users? Got to eliminate the from the route
app.use("/api/businessunits", businessUnitsRouter);
app.use("/api/indicators", indicatorsRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/info", infoRouter);
app.use("/api", outcomeRouter);
app.use("/api", incomeRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

export default app;
