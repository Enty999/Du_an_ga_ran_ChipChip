const express = require("express");
const router = express.Router();
const { yeuCauDangNhap } = require("../middlewares/kiem-tra-dang-nhap.middleware");

// Bật bảo vệ cho TẤT CẢ các đường dẫn trong file này:
router.use(yeuCauDangNhap);

// GET /tai-khoan
router.get("/", (req, res) => {
  res.send(`<h1>Xin chào ${res.locals.nguoiDung.hoTen}!</h1>`);
});

// GET /tai-khoan/don-hang
router.get("/don-hang", (req, res) => {
  res.send(`<h1>Danh sách đơn hàng của bạn</h1>`);
});

module.exports = router;
