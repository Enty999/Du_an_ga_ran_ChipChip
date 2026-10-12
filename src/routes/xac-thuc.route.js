const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const kiemTraDangKyMiddleware = require("../middlewares/kiem-tra-dang-ky.middleware");

// Đường dẫn trang Đăng nhập
router.get("/dang-nhap", authController.renderDangNhap);
// Xử lý đăng nhập
router.post("/dang-nhap", authController.xuLiDangNhap);

// Đường dẫn trang Đăng ký
router.get("/dang-ky", authController.renderDangKy);
// Xử lý đăng ký
router.post("/dang-ky",kiemTraDangKyMiddleware.kiemTraDangKy, authController.xuLiDangKy);

// Đường dẫn trang Xác nhận OTP
router.get("/xac-nhan-otp", authController.renderXacNhanOTP);
// Xử lý xác nhận OTP
router.post("/xac-nhan-otp", authController.xuLiXacNhanOTP);

// Đăng xuất
router.post("/dang-xuat", authController.xuLiDangXuat);

module.exports = router;
