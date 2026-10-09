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

// Đường dẫn trang Xác nhận OTP
router.get("/xac-nhan-otp", authController.renderXacNhanOTP);
// Xử lý xác nhận OTP
router.post("/xac-nhan-otp", authController.xuLiXacNhanOTP);

// TODO (BE) - Bước 3: Đăng xuất (header gửi form POST tới /auth/dang-xuat)
// router.post("/dang-xuat", authController.xuLiDangXuat);

module.exports = router;
