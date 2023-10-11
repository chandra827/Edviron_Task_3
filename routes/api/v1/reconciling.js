const express = require("express");
const router = express.Router();
const reconcilingApi = require("../../../controllers/api/v1/reconciling");

router.get("/", reconcilingApi.reconciling);

module.exports = router;
