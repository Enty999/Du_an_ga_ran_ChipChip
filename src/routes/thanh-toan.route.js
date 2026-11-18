const express = require("express");
const router = express.Router();
const thanhToanController = require("../controllers/thanh-toan.controller");

// 1. Hiển thị trang thanh toán
router.get("/", thanhToanController.renderTrangThanhToan);

// 2. Nhận thông tin đặt hàng từ form
router.post("/", thanhToanController.xuLyDatHang);

// 3. Cổng thanh toán VietQR
router.get("/vietqr", thanhToanController.renderVietQR);

// 4. API xác nhận đã chuyển khoản
router.post("/xac-nhan", thanhToanController.xacNhanThanhToan);

// 5. Trang thông báo đặt hàng thành công
router.get("/thanh-cong", thanhToanController.renderThanhCong);

// Route kiểm tra trạng thái thanh toán tự động (Polling mỗi 2 giây)
router.get("/kiem-tra/:maDonHang", thanhToanController.kiemTraThanhToan);

// API Áp dụng mã giảm giá
router.post("/ap-dung-ma", thanhToanController.kiemTraMaGiamGia);
module.exports = router;