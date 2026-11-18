const express = require("express");
const router = express.Router();
const khuyenMaiController = require("../controllers/khuyen-mai.controller");

// Đường dẫn trang khuyến mãi khách hàng
router.get("/", khuyenMaiController.renderTrangKhuyenMai);

module.exports = router;