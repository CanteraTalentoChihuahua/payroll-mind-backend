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

// const parse = require("csv-parse").parse;
// const upload = multer({ dest: os.tmpdir() });

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
    res.send("Works... For now.");
});

// app.post("/read", upload.single("file"), (req, res) => {
//     const file = req.file;

//     // @ts-ignore: Unreachable code error
//     const data = fs.readFileSync(file.path);
//     // @ts-ignore: Unreachable code error
//     parse(data, (err, records) => {
//         if (err) {
//             console.error(err);
//             return res.status(400).json({ success: false, message: "An error occurred" });
//         }

//         return res.json({ data: records });
//     });
// });

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
