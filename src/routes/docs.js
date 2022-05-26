const router = require("express").Router();
const ui = require("swagger-ui-express");
const json = require("../../docs/openapi.json");

router.use("/docs", ui.serve);
router.get("/docs", ui.setup(json));

module.exports = router;
