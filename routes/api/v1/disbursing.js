const express = require("express");
const router = express.Router();
const disbursingApi = require("../../../controllers/api/v1/disbursing");

router.get("/", disbursingApi.disbursing);

module.exports = router;
