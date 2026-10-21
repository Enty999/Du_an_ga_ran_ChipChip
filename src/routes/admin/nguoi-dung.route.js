const express = require("express");
const router = express.Router();
const nguoiDungController = require("../../controllers/admin/nguoi-dung.controller");
const nguoiDungValidate = require("../../validations/nguoi-dung.validate");

// [GET] /admin/nguoi-dung - Danh sách người dùng
router.get("/", nguoiDungController.index);
router.get("/them-moi", (req, res) => res.redirect("/admin/nguoi-dung?openModal=them"));

// [POST] /admin/nguoi-dung/them-moi - Thêm người dùng mới
router.post("/them-moi", nguoiDungValidate.taoMoi, nguoiDungController.xuLiThemMoi);
router.post("/", nguoiDungValidate.taoMoi, nguoiDungController.xuLiThemMoi);

// [GET] /admin/nguoi-dung/chinh-sua/:id - Giao diện sửa người dùng
router.get("/chinh-sua/:id", nguoiDungValidate.idHopLe, nguoiDungController.renderChinhSua);

// [POST | PUT] /admin/nguoi-dung/chinh-sua/:id - Xử lý sửa người dùng
router.post("/chinh-sua/:id", nguoiDungValidate.capNhat, nguoiDungController.xuLiChinhSua);
router.put("/:id", nguoiDungValidate.capNhat, nguoiDungController.xuLiChinhSua);

// [POST | DELETE] /admin/nguoi-dung/xoa/:id - Xử lý xóa người dùng
router.post("/xoa/:id", nguoiDungValidate.idHopLe, nguoiDungController.xuLiXoa);
router.delete("/:id", nguoiDungValidate.idHopLe, nguoiDungController.xuLiXoa);

// [POST | PATCH] /admin/nguoi-dung/doi-trang-thai/:id - Khóa / Mở khóa nhanh
router.post("/doi-trang-thai/:id", nguoiDungValidate.doiTrangThai, nguoiDungController.xuLiDoiTrangThai);
router.patch("/:id/trang-thai", nguoiDungValidate.doiTrangThai, nguoiDungController.xuLiDoiTrangThai);

module.exports = router;
