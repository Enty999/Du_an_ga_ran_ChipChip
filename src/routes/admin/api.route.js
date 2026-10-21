// Router RESTful API Chuẩn Phân hệ Admin ChipChip với Tầng Validate Middleware
const express = require("express");
const router = express.Router();

const {
  sanPhamApi,
  danhMucApi,
  khuyenMaiApi,
  nguoiDungApi,
  donHangApi,
  tongQuanApi,
} = require("../../controllers/admin/api.controller");

// Import Middleware Validation
const sanPhamValidate = require("../../validations/san-pham.validate");
const danhMucValidate = require("../../validations/danh-muc.validate");
const khuyenMaiValidate = require("../../validations/khuyen-mai.validate");
const nguoiDungValidate = require("../../validations/nguoi-dung.validate");
const donHangValidate = require("../../validations/don-hang.validate");

// ==========================================
// 1. SẢN PHẨM / MÓN ĂN RESTFUL API
// ==========================================
router.get("/san-pham", sanPhamApi.layDanhSach);
router.get("/san-pham/:id", sanPhamValidate.idHopLe, sanPhamApi.layChiTiet);
router.post("/san-pham", sanPhamValidate.taoMoi, sanPhamApi.taoMoi);
router.put("/san-pham/:id", sanPhamValidate.capNhat, sanPhamApi.capNhat);
router.patch("/san-pham/:id/trang-thai", sanPhamValidate.doiTrangThai, sanPhamApi.doiTrangThai);
router.delete("/san-pham/:id", sanPhamValidate.idHopLe, sanPhamApi.xoa);

// Alias URL linh hoạt
router.post("/san-pham/them-moi", sanPhamValidate.taoMoi, sanPhamApi.taoMoi);
router.post("/san-pham/chinh-sua/:id", sanPhamValidate.capNhat, sanPhamApi.capNhat);
router.post("/san-pham/doi-trang-thai/:id", sanPhamValidate.doiTrangThai, sanPhamApi.doiTrangThai);
router.post("/san-pham/xoa/:id", sanPhamValidate.idHopLe, sanPhamApi.xoa);

// ==========================================
// 2. DANH MỤC RESTFUL API
// ==========================================
router.get("/danh-muc", danhMucApi.layDanhSach);
router.get("/danh-muc/:id", danhMucValidate.idHopLe, danhMucApi.layChiTiet);
router.post("/danh-muc", danhMucValidate.taoMoi, danhMucApi.taoMoi);
router.put("/danh-muc/:id", danhMucValidate.capNhat, danhMucApi.capNhat);
router.patch("/danh-muc/:id/trang-thai", danhMucValidate.doiTrangThai, danhMucApi.doiTrangThai);
router.delete("/danh-muc/:id", danhMucValidate.idHopLe, danhMucApi.xoa);

// Alias
router.post("/danh-muc/them-moi", danhMucValidate.taoMoi, danhMucApi.taoMoi);
router.post("/danh-muc/chinh-sua/:id", danhMucValidate.capNhat, danhMucApi.capNhat);
router.post("/danh-muc/doi-trang-thai/:id", danhMucValidate.doiTrangThai, danhMucApi.doiTrangThai);
router.post("/danh-muc/xoa/:id", danhMucValidate.idHopLe, danhMucApi.xoa);

// ==========================================
// 3. KHUYẾN MÃI / VOUCHER RESTFUL API
// ==========================================
router.get("/khuyen-mai", khuyenMaiApi.layDanhSach);
router.get("/khuyen-mai/:id", khuyenMaiValidate.idHopLe, khuyenMaiApi.layChiTiet);
router.post("/khuyen-mai", khuyenMaiValidate.taoMoi, khuyenMaiApi.taoMoi);
router.put("/khuyen-mai/:id", khuyenMaiValidate.capNhat, khuyenMaiApi.capNhat);
router.patch("/khuyen-mai/:id/trang-thai", khuyenMaiValidate.doiTrangThai, khuyenMaiApi.doiTrangThai);
router.delete("/khuyen-mai/:id", khuyenMaiValidate.idHopLe, khuyenMaiApi.xoa);

// Alias
router.post("/khuyen-mai/them-moi", khuyenMaiValidate.taoMoi, khuyenMaiApi.taoMoi);
router.post("/khuyen-mai/chinh-sua/:id", khuyenMaiValidate.capNhat, khuyenMaiApi.capNhat);
router.post("/khuyen-mai/doi-trang-thai/:id", khuyenMaiValidate.doiTrangThai, khuyenMaiApi.doiTrangThai);
router.post("/khuyen-mai/xoa/:id", khuyenMaiValidate.idHopLe, khuyenMaiApi.xoa);

// ==========================================
// 4. NGƯỜI DÙNG RESTFUL API
// ==========================================
router.get("/nguoi-dung", nguoiDungApi.layDanhSach);
router.get("/nguoi-dung/:id", nguoiDungValidate.idHopLe, nguoiDungApi.layChiTiet);
router.post("/nguoi-dung", nguoiDungValidate.taoMoi, nguoiDungApi.taoMoi);
router.put("/nguoi-dung/:id", nguoiDungValidate.capNhat, nguoiDungApi.capNhat);
router.patch("/nguoi-dung/:id/trang-thai", nguoiDungValidate.doiTrangThai, nguoiDungApi.doiTrangThai);
router.delete("/nguoi-dung/:id", nguoiDungValidate.idHopLe, nguoiDungApi.xoa);

// Alias
router.post("/nguoi-dung/them-moi", nguoiDungValidate.taoMoi, nguoiDungApi.taoMoi);
router.post("/nguoi-dung/chinh-sua/:id", nguoiDungValidate.capNhat, nguoiDungApi.capNhat);
router.post("/nguoi-dung/doi-trang-thai/:id", nguoiDungValidate.doiTrangThai, nguoiDungApi.doiTrangThai);
router.post("/nguoi-dung/xoa/:id", nguoiDungValidate.idHopLe, nguoiDungApi.xoa);

// ==========================================
// 5. ĐƠN HÀNG RESTFUL API
// ==========================================
router.get("/don-hang", donHangApi.layDanhSach);
router.get("/don-hang/:id", donHangValidate.idHopLe, donHangApi.layChiTiet);
router.patch("/don-hang/:id/trang-thai", donHangValidate.capNhatTrangThai, donHangApi.capNhatTrangThai);
router.delete("/don-hang/:id", donHangValidate.idHopLe, donHangApi.xoa);

// Alias
router.post("/don-hang/cap-nhat-trang-thai/:id", donHangValidate.capNhatTrangThai, donHangApi.capNhatTrangThai);
router.post("/don-hang/xoa/:id", donHangValidate.idHopLe, donHangApi.xoa);

// ==========================================
// 6. TỔNG QUAN & BÁO CÁO THỐNG KÊ RESTFUL API
// ==========================================
router.get("/tong-quan", tongQuanApi.layThongKe);

module.exports = router;
