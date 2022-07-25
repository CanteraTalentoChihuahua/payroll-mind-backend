import businessUnitsRouter from "./routes/businessUnits";
import payrollRouter from "./routes/payroll";
import outcomeRouter from "./routes/outcomes";
import incomeRouter from "./routes/incomes";
import usersRouter from "./routes/users";
import infoRouter from "./routes/info";
import authRouter from "./routes/auth";
import docsRouter from "./routes/docs";
import express from "express";
import cors from "cors";
import {resolve} from "path";
import jiraRouter from "./routes/jira";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/jira/connect.json", express.static(resolve(__dirname, "..", "public", "atlassian-connect.json")));

// Routes
app.get("/", (_req, res) => {
    res.send("Works!");
});

// Should we add /users to users? Got to eliminate the from the route
app.use("/api/businessunits", businessUnitsRouter);
app.use("/api/payroll", payrollRouter);
app.use("/api/info", infoRouter);
app.use("/api", outcomeRouter);
app.use("/api", incomeRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);
app.use("/jira", jiraRouter);

export default app;
