const express = require("express");
const router = express.Router();
const danhMucController = require("../../controllers/admin/danh-muc.controller");
const danhMucValidate = require("../../validations/danh-muc.validate");

// [GET] /admin/danh-muc - Danh sách danh mục
router.get("/", danhMucController.index);

// [GET] /admin/danh-muc/them-moi - Giao diện thêm danh mục
router.get("/them-moi", danhMucController.renderThemMoi);

// [POST] /admin/danh-muc/them-moi - Xử lý thêm danh mục
router.post("/them-moi", danhMucValidate.taoMoi, danhMucController.xuLiThemMoi);
router.post("/", danhMucValidate.taoMoi, danhMucController.xuLiThemMoi);

// [GET] /admin/danh-muc/chinh-sua/:id - Giao diện sửa danh mục
router.get("/chinh-sua/:id", danhMucValidate.idHopLe, danhMucController.renderChinhSua);

// [POST | PUT] /admin/danh-muc/chinh-sua/:id - Xử lý sửa danh mục
router.post("/chinh-sua/:id", danhMucValidate.capNhat, danhMucController.xuLiChinhSua);
router.put("/:id", danhMucValidate.capNhat, danhMucController.xuLiChinhSua);

// [POST | DELETE] /admin/danh-muc/xoa/:id - Xử lý xóa danh mục
router.post("/xoa/:id", danhMucValidate.idHopLe, danhMucController.xuLiXoa);
router.delete("/:id", danhMucValidate.idHopLe, danhMucController.xuLiXoa);

// [POST | PATCH] /admin/danh-muc/doi-trang-thai/:id - Đổi trạng thái hiển thị nhanh
router.post("/doi-trang-thai/:id", danhMucValidate.doiTrangThai, danhMucController.xuLiDoiTrangThai);
router.patch("/:id/trang-thai", danhMucValidate.doiTrangThai, danhMucController.xuLiDoiTrangThai);

module.exports = router;
