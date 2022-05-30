const router = require("express").Router();
import ui from "swagger-ui-express";
import json from "../docs/openapi.json";

router.use("/docs", ui.serve);
router.get("/docs", ui.setup(json));

export default router;
