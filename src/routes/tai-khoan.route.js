const express = require("express");
const router = express.Router();
const { yeuCauDangNhap } = require("../middlewares/kiem-tra-dang-nhap.middleware");
const taiKhoanController = require("../controllers/tai-khoan.controller");

// Bật bảo vệ cho TẤT CẢ các đường dẫn trong file này:
router.use(yeuCauDangNhap);

// GET /tai-khoan
router.get("/", taiKhoanController.renderThongTin);

// POST /tai-khoan/cap-nhat
router.post("/cap-nhat", taiKhoanController.xuLiCapNhatThongTin);

// GET /tai-khoan/don-hang
router.get("/don-hang", taiKhoanController.renderDonHang);

module.exports = router;
