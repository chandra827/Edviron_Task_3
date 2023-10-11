const express = require("express");
const router = express.Router();

router.use("/reconciling", require("./reconciling"));
router.use("/disbursing", require("./disbursing"));

module.exports = router;
