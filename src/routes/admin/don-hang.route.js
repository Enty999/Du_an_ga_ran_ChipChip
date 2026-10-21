const express = require("express");
const router = express.Router();
const donHangController = require("../../controllers/admin/don-hang.controller");
const donHangValidate = require("../../validations/don-hang.validate");

// [GET] /admin/don-hang - Danh sách đơn hàng
router.get("/", donHangController.index);

// [GET] /admin/don-hang/chi-tiet/:id - Chi tiết đơn hàng
router.get("/chi-tiet/:id", donHangValidate.idHopLe, donHangController.chiTiet);

// [POST | PATCH] /admin/don-hang/cap-nhat-trang-thai/:id - Cập nhật trạng thái đơn
router.post("/cap-nhat-trang-thai/:id", donHangValidate.capNhatTrangThai, donHangController.xuLiCapNhatTrangThai);
router.patch("/:id/trang-thai", donHangValidate.capNhatTrangThai, donHangController.xuLiCapNhatTrangThai);

// [POST | DELETE] /admin/don-hang/xoa/:id - Xóa đơn hàng
router.post("/xoa/:id", donHangValidate.idHopLe, donHangController.xuLiXoa);
router.delete("/:id", donHangValidate.idHopLe, donHangController.xuLiXoa);

module.exports = router;
