const express = require("express");
const router = express.Router();
const khuyenMaiController = require("../../controllers/admin/khuyen-mai.controller");
const khuyenMaiValidate = require("../../validations/khuyen-mai.validate");

// [GET] /admin/khuyen-mai - Danh sách khuyến mãi
router.get("/", khuyenMaiController.index);

// [GET] /admin/khuyen-mai/them-moi - Giao diện thêm khuyến mãi
router.get("/them-moi", khuyenMaiController.renderThemMoi);

// [POST] /admin/khuyen-mai/them-moi - Xử lý thêm khuyến mãi
router.post("/them-moi", khuyenMaiValidate.taoMoi, khuyenMaiController.xuLiThemMoi);
router.post("/", khuyenMaiValidate.taoMoi, khuyenMaiController.xuLiThemMoi);

// [GET] /admin/khuyen-mai/chinh-sua/:id - Giao diện sửa khuyến mãi
router.get("/chinh-sua/:id", khuyenMaiValidate.idHopLe, khuyenMaiController.renderChinhSua);

// [POST | PUT] /admin/khuyen-mai/chinh-sua/:id - Xử lý sửa khuyến mãi
router.post("/chinh-sua/:id", khuyenMaiValidate.capNhat, khuyenMaiController.xuLiChinhSua);
router.put("/:id", khuyenMaiValidate.capNhat, khuyenMaiController.xuLiChinhSua);

// [POST | DELETE] /admin/khuyen-mai/xoa/:id - Xử lý xóa khuyến mãi
router.post("/xoa/:id", khuyenMaiValidate.idHopLe, khuyenMaiController.xuLiXoa);
router.delete("/:id", khuyenMaiValidate.idHopLe, khuyenMaiController.xuLiXoa);

// [POST | PATCH] /admin/khuyen-mai/doi-trang-thai/:id - Đổi trạng thái mã nhanh
router.post("/doi-trang-thai/:id", khuyenMaiValidate.doiTrangThai, khuyenMaiController.xuLiDoiTrangThai);
router.patch("/:id/trang-thai", khuyenMaiValidate.doiTrangThai, khuyenMaiController.xuLiDoiTrangThai);

module.exports = router;
