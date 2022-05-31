const trialRouter = require("./routes/trial_routes");
const authRouter = require("./routes/auth");
const docsRouter = require("./routes/docs");
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("Works!");
});

app.use("/trial", trialRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

module.exports = app;
