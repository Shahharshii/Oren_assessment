const express = require("express");
const router = express.Router();
const { createMetric, getMetrics } = require("../controller/metriccontrol");
const { verifyToken } = require("../middleware/verfication");

router.post("/create", verifyToken, createMetric);
router.get("/get", verifyToken, getMetrics);

module.exports = router;
