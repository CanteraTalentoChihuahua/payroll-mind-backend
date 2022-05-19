const express = require('express');
const trialRouter = express.Router();

trialRouter.get('/', (req, res) => {
    res.send('Works too!');
})

module.exports = trialRouter;