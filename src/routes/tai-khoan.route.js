const express = require("express");
const router = express.Router();
const { yeuCauDangNhap } = require("../middlewares/kiem-tra-dang-nhap.middleware");
const taiKhoanController = require("../controllers/tai-khoan.controller");

// Trạm gác cổng bảo vệ
router.use(yeuCauDangNhap);

// Định tuyến đường đi
router.get("/", taiKhoanController.trangThongTin);
router.post("/cap-nhat", taiKhoanController.xuLiCapNhat);
router.get("/don-hang", taiKhoanController.trangDonHang);
router.get("/doi-mat-khau", taiKhoanController.trangDoiMatKhau);
router.post("/doi-mat-khau", taiKhoanController.doiMatKhau);

module.exports = router;
