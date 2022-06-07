import express from "express";
const trialRouter = express.Router();

trialRouter.get("/", (req, res) => {
    res.send("Works too!");
});

export default trialRouter;
