const express = require("express");
const router = express.Router();
const sanPhamController = require("../../controllers/admin/san-pham.controller");
const sanPhamValidate = require("../../validations/san-pham.validate");

// [GET] /admin/san-pham - Danh sách món ăn
router.get("/", sanPhamController.index);

// [GET] /admin/san-pham/them-moi - Giao diện thêm món
router.get("/them-moi", sanPhamController.renderThemMoi);

// [POST] /admin/san-pham/them-moi - Xử lý thêm món
router.post("/them-moi", sanPhamValidate.taoMoi, sanPhamController.xuLiThemMoi);
router.post("/", sanPhamValidate.taoMoi, sanPhamController.xuLiThemMoi);

// [GET] /admin/san-pham/chinh-sua/:id - Giao diện sửa món
router.get("/chinh-sua/:id", sanPhamValidate.idHopLe, sanPhamController.renderChinhSua);

// [POST | PUT] /admin/san-pham/chinh-sua/:id - Xử lý sửa món
router.post("/chinh-sua/:id", sanPhamValidate.capNhat, sanPhamController.xuLiChinhSua);
router.put("/:id", sanPhamValidate.capNhat, sanPhamController.xuLiChinhSua);

// [POST | DELETE] /admin/san-pham/xoa/:id - Xử lý xóa món
router.post("/xoa/:id", sanPhamValidate.idHopLe, sanPhamController.xuLiXoa);
router.delete("/:id", sanPhamValidate.idHopLe, sanPhamController.xuLiXoa);

// [POST | PATCH] /admin/san-pham/doi-trang-thai/:id - Đổi trạng thái nhanh
router.post("/doi-trang-thai/:id", sanPhamValidate.doiTrangThai, sanPhamController.xuLiDoiTrangThai);
router.patch("/:id/trang-thai", sanPhamValidate.doiTrangThai, sanPhamController.xuLiDoiTrangThai);

module.exports = router;
