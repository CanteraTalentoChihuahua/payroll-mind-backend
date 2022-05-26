const trialRouter = require("./routes/trial_routes");
const authRouter = require("./routes/auth");
const docsRouter = require("./routes/docs");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Works!");
});

app.use("/trial", trialRouter);
app.use("/api", authRouter);
app.use("/", docsRouter);

module.exports = app;
