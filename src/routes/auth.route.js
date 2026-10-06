const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đường dẫn trang Đăng nhập
router.get("/dang-nhap", authController.renderDangNhap);
// Xử lý đăng nhập
router.post("/dang-nhap", authController.xuLiDangNhap);

// Đường dẫn trang Đăng ký
router.get("/dang-ky", authController.renderDangKy);
// Xử lý đăng ký
router.post("/dang-ky", authController.xuLiDangKy);

module.exports = router;
