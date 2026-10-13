const express = require("express");
const router = express.Router();
const tongQuanController = require("../../controllers/admin/tong-quan.controller");

router.get("/", tongQuanController.index);

module.exports = router;
