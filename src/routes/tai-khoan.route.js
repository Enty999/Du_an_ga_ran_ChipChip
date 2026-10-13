const express = require("express");
const router = express.Router();
const { yeuCauDangNhap } = require("../middlewares/kiem-tra-dang-nhap.middleware");

// Bật bảo vệ cho TẤT CẢ các đường dẫn trong file này:
router.use(yeuCauDangNhap);

// GET /tai-khoan
router.get("/", (req, res) => {
  res.render("pages/tai-khoan/thong-tin",{
    title: "Thông tin tài khoản",
  });
});

// GET /tai-khoan/don-hang
router.get("/don-hang", (req, res) => {
  res.render('pages/tai-khoan/don-hang',{
    title: "Đơn hàng của tôi",
  });
});

module.exports = router;
