const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đường dẫn trang Đăng nhập
router.get("/dang-nhap", authController.renderDangNhap);

// Đường dẫn trang Đăng ký
router.get("/dang-ky", authController.renderDangKy);

module.exports = router;
