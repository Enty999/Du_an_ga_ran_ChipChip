// Controller RESTful API Admin ChipChip - Chuẩn Kiến trúc RESTful
const sanPhamService = require("../../services/san-pham.service");
const danhMucService = require("../../services/danh-muc.service");
const khuyenMaiService = require("../../services/khuyen-mai.service");
const nguoiDungService = require("../../services/nguoi-dung.service");
const donHangService = require("../../services/don-hang.service");
const { dinhDangTien, dinhDangNgay } = require("../../utils/dinh-dang.util");

// Import Helper phản hồi chuẩn RESTful (JSend / JSON:API)
const {
  phanHoiThanhCong: guiPhanHoiThanhCong,
  phanHoiLoi: guiPhanHoiLoi,
  phanHoiPhanTrang,
} = require("../../utils/phan-hoi.util");

// ============================================================================
// 1. RESTFUL API SẢN PHẨM / MÓN ĂN
// ============================================================================
const sanPhamApi = {
  // [GET] /admin/api/san-pham
  layDanhSach: async (req, res) => {
    try {
      const { tuKhoa, maDanhMuc, trangThai, trang, gioiHan } = req.query;
      const ketQua = await sanPhamService.layDanhSach({
        tuKhoa,
        maDanhMuc,
        trangThai,
        trang: Number(trang) || 1,
        gioiHan: Number(gioiHan) || 10,
      });
      return guiPhanHoiThanhCong(res, 200, "Lấy danh sách món ăn thành công", ketQua);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi máy chủ khi lấy món ăn", error.message);
    }
  },

  // [GET] /admin/api/san-pham/:id
  layChiTiet: async (req, res) => {
    try {
      const { id } = req.params;
      const sp = await sanPhamService.layTheoId(id);
      if (!sp) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy món ăn yêu cầu");
      }
      return guiPhanHoiThanhCong(res, 200, "Lấy chi tiết món ăn thành công", sp);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy chi tiết món ăn", error.message);
    }
  },

  // [POST] /admin/api/san-pham
  taoMoi: async (req, res) => {
    try {
      if (!req.body.tenSanPham || !req.body.tenSanPham.trim()) {
        return guiPhanHoiLoi(res, 400, "Tên món ăn không được để trống!");
      }
      if (!req.body.maDanhMuc) {
        return guiPhanHoiLoi(res, 400, "Vui lòng chọn danh mục món!");
      }
      if (req.body.giaGoc === undefined || req.body.giaGoc === "") {
        return guiPhanHoiLoi(res, 400, "Giá gốc không được để trống!");
      }

      const spMoi = await sanPhamService.taoMoi(req.body);
      return guiPhanHoiThanhCong(res, 201, "Tạo món ăn mới thành công!", spMoi);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Không thể tạo món ăn mới", error.message);
    }
  },

  // [PUT] /admin/api/san-pham/:id
  capNhat: async (req, res) => {
    try {
      const { id } = req.params;
      const spCapNhat = await sanPhamService.capNhat(id, req.body);
      if (!spCapNhat) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy món ăn để cập nhật");
      }
      return guiPhanHoiThanhCong(res, 200, "Cập nhật món ăn thành công!", spCapNhat);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi cập nhật món ăn", error.message);
    }
  },

  // [PATCH] /admin/api/san-pham/:id/trang-thai
  doiTrangThai: async (req, res) => {
    try {
      const { id } = req.params;
      const { trangThai } = req.body;
      if (!trangThai) {
        return guiPhanHoiLoi(res, 400, "Thiếu trạng thái cập nhật");
      }
      const sp = await sanPhamService.doiTrangThai(id, trangThai);
      return guiPhanHoiThanhCong(res, 200, "Đã cập nhật trạng thái món ăn!", sp);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi cập nhật trạng thái món ăn", error.message);
    }
  },

  // [DELETE] /admin/api/san-pham/:id
  xoa: async (req, res) => {
    try {
      const { id } = req.params;
      await sanPhamService.xoa(id);
      return guiPhanHoiThanhCong(res, 200, "Đã xóa món ăn thành công!");
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi khi xóa món ăn", error.message);
    }
  },
};

// ============================================================================
// 2. RESTFUL API DANH MỤC
// ============================================================================
const danhMucApi = {
  // [GET] /admin/api/danh-muc
  layDanhSach: async (req, res) => {
    try {
      const danhSach = await danhMucService.layTatCa();
      return guiPhanHoiThanhCong(res, 200, "Lấy danh sách danh mục thành công", danhSach);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy danh sách danh mục", error.message);
    }
  },

  // [GET] /admin/api/danh-muc/:id
  layChiTiet: async (req, res) => {
    try {
      const { id } = req.params;
      const dm = await danhMucService.layTheoId(id);
      if (!dm) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy danh mục yêu cầu");
      }
      return guiPhanHoiThanhCong(res, 200, "Lấy chi tiết danh mục thành công", dm);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy chi tiết danh mục", error.message);
    }
  },

  // [POST] /admin/api/danh-muc
  taoMoi: async (req, res) => {
    try {
      if (!req.body.tenDanhMuc || !req.body.tenDanhMuc.trim()) {
        return guiPhanHoiLoi(res, 400, "Tên danh mục không được để trống!");
      }
      const dmMoi = await danhMucService.taoMoi(req.body);
      return guiPhanHoiThanhCong(res, 201, "Tạo danh mục mới thành công!", dmMoi);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi tạo danh mục", error.message);
    }
  },

  // [PUT] /admin/api/danh-muc/:id
  capNhat: async (req, res) => {
    try {
      const { id } = req.params;
      const dmCapNhat = await danhMucService.capNhat(id, req.body);
      if (!dmCapNhat) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy danh mục để cập nhật");
      }
      return guiPhanHoiThanhCong(res, 200, "Cập nhật danh mục thành công!", dmCapNhat);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi cập nhật danh mục", error.message);
    }
  },

  // [PATCH] /admin/api/danh-muc/:id/trang-thai
  doiTrangThai: async (req, res) => {
    try {
      const { id } = req.params;
      const { trangThai } = req.body;
      const dm = await danhMucService.doiTrangThai(id, trangThai);
      return guiPhanHoiThanhCong(res, 200, "Đã cập nhật trạng thái danh mục!", dm);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi cập nhật trạng thái danh mục", error.message);
    }
  },

  // [DELETE] /admin/api/danh-muc/:id
  xoa: async (req, res) => {
    try {
      const { id } = req.params;
      await danhMucService.xoa(id);
      return guiPhanHoiThanhCong(res, 200, "Đã xóa danh mục thành công!");
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Không thể xóa danh mục", error.message);
    }
  },
};

// ============================================================================
// 3. RESTFUL API KHUYẾN MÃI / VOUCHER
// ============================================================================
const khuyenMaiApi = {
  // [GET] /admin/api/khuyen-mai
  layDanhSach: async (req, res) => {
    try {
      const danhSach = await khuyenMaiService.layDanhSach();
      return guiPhanHoiThanhCong(res, 200, "Lấy danh sách khuyến mãi thành công", danhSach);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy danh sách khuyến mãi", error.message);
    }
  },

  // [GET] /admin/api/khuyen-mai/:id
  layChiTiet: async (req, res) => {
    try {
      const { id } = req.params;
      const km = await khuyenMaiService.layTheoId(id);
      if (!km) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy mã khuyến mãi");
      }
      return guiPhanHoiThanhCong(res, 200, "Lấy chi tiết mã khuyến mãi thành công", km);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy chi tiết khuyến mãi", error.message);
    }
  },

  // [POST] /admin/api/khuyen-mai
  taoMoi: async (req, res) => {
    try {
      if (!req.body.maCode || !req.body.maCode.trim()) {
        return guiPhanHoiLoi(res, 400, "Mã Voucher không được để trống!");
      }
      if (!req.body.tieuDe || !req.body.tieuDe.trim()) {
        return guiPhanHoiLoi(res, 400, "Tiêu đề khuyến mãi không được để trống!");
      }
      const kmMoi = await khuyenMaiService.taoMoi(req.body);
      return guiPhanHoiThanhCong(res, 201, "Tạo mã khuyến mãi mới thành công!", kmMoi);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi tạo mã khuyến mãi", error.message);
    }
  },

  // [PUT] /admin/api/khuyen-mai/:id
  capNhat: async (req, res) => {
    try {
      const { id } = req.params;
      const kmCapNhat = await khuyenMaiService.capNhat(id, req.body);
      if (!kmCapNhat) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy mã khuyến mãi để cập nhật");
      }
      return guiPhanHoiThanhCong(res, 200, "Cập nhật mã khuyến mãi thành công!", kmCapNhat);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi cập nhật mã khuyến mãi", error.message);
    }
  },

  // [PATCH] /admin/api/khuyen-mai/:id/trang-thai
  doiTrangThai: async (req, res) => {
    try {
      const { id } = req.params;
      const { trangThai } = req.body;
      const km = await khuyenMaiService.doiTrangThai(id, trangThai);
      return guiPhanHoiThanhCong(res, 200, "Đã cập nhật trạng thái voucher!", km);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi cập nhật trạng thái voucher", error.message);
    }
  },

  // [DELETE] /admin/api/khuyen-mai/:id
  xoa: async (req, res) => {
    try {
      const { id } = req.params;
      await khuyenMaiService.xoa(id);
      return guiPhanHoiThanhCong(res, 200, "Đã xóa mã khuyến mãi thành công!");
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi khi xóa mã khuyến mãi", error.message);
    }
  },
};

// ============================================================================
// 4. RESTFUL API NGƯỜI DÙNG / TÀI KHOẢN
// ============================================================================
const nguoiDungApi = {
  // [GET] /admin/api/nguoi-dung
  layDanhSach: async (req, res) => {
    try {
      const { tuKhoa, vaiTro, trangThai, trang, gioiHan } = req.query;
      const ketQua = await nguoiDungService.layDanhSach({
        tuKhoa,
        vaiTro,
        trangThai,
        trang: Number(trang) || 1,
        gioiHan: Number(gioiHan) || 10,
      });
      return guiPhanHoiThanhCong(res, 200, "Lấy danh sách tài khoản thành công", ketQua);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy danh sách tài khoản", error.message);
    }
  },

  // [GET] /admin/api/nguoi-dung/:id
  layChiTiet: async (req, res) => {
    try {
      const { id } = req.params;
      const u = await nguoiDungService.layTheoId(id);
      if (!u) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy tài khoản người dùng");
      }
      return guiPhanHoiThanhCong(res, 200, "Lấy chi tiết người dùng thành công", u);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy chi tiết người dùng", error.message);
    }
  },

  // [POST] /admin/api/nguoi-dung
  taoMoi: async (req, res) => {
    try {
      if (!req.body.hoTen || !req.body.hoTen.trim()) {
        return guiPhanHoiLoi(res, 400, "Họ và tên không được để trống!");
      }
      if (!req.body.email || !req.body.email.trim()) {
        return guiPhanHoiLoi(res, 400, "Địa chỉ email không được để trống!");
      }
      const uMoi = await nguoiDungService.taoMoi(req.body);
      return guiPhanHoiThanhCong(res, 201, "Tạo tài khoản người dùng mới thành công!", uMoi);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi tạo tài khoản", error.message);
    }
  },

  // [PUT] /admin/api/nguoi-dung/:id
  capNhat: async (req, res) => {
    try {
      const { id } = req.params;
      const uCapNhat = await nguoiDungService.capNhat(id, req.body);
      if (!uCapNhat) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy tài khoản để cập nhật");
      }
      return guiPhanHoiThanhCong(res, 200, "Cập nhật tài khoản người dùng thành công!", uCapNhat);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi cập nhật người dùng", error.message);
    }
  },

  // [PATCH] /admin/api/nguoi-dung/:id/trang-thai
  doiTrangThai: async (req, res) => {
    try {
      const { id } = req.params;
      const { trangThai } = req.body;
      const u = await nguoiDungService.doiTrangThai(id, trangThai);
      return guiPhanHoiThanhCong(res, 200, "Đã cập nhật trạng thái tài khoản!", u);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi đổi trạng thái tài khoản", error.message);
    }
  },

  // [DELETE] /admin/api/nguoi-dung/:id
  xoa: async (req, res) => {
    try {
      const { id } = req.params;
      await nguoiDungService.xoa(id);
      return guiPhanHoiThanhCong(res, 200, "Đã xóa tài khoản thành công!");
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi khi xóa tài khoản", error.message);
    }
  },
};

// ============================================================================
// 5. RESTFUL API ĐƠN HÀNG
// ============================================================================
const donHangApi = {
  // [GET] /admin/api/don-hang
  layDanhSach: async (req, res) => {
    try {
      const { tuKhoa, trangThaiDonHang, trangThaiThanhToan, trang, gioiHan } = req.query;
      const ketQua = await donHangService.layDanhSach({
        tuKhoa,
        trangThaiDonHang,
        trangThaiThanhToan,
        trang: Number(trang) || 1,
        gioiHan: Number(gioiHan) || 10,
      });
      return guiPhanHoiThanhCong(res, 200, "Lấy danh sách đơn hàng thành công", ketQua);
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy danh sách đơn hàng", error.message);
    }
  },

  // [GET] /admin/api/don-hang/:id
  layChiTiet: async (req, res) => {
    try {
      const { id } = req.params;
      const donHang = await donHangService.layTheoId(id);
      if (!donHang) {
        return guiPhanHoiLoi(res, 404, "Không tìm thấy đơn hàng yêu cầu");
      }
      return guiPhanHoiThanhCong(res, 200, "Lấy chi tiết đơn hàng thành công", {
        ...donHang,
        tongTienFormatted: dinhDangTien(donHang.tongThanhToan),
        ngayTaoFormatted: dinhDangNgay(donHang.createdAt),
      });
    } catch (error) {
      return guiPhanHoiLoi(res, 500, "Lỗi lấy chi tiết đơn hàng", error.message);
    }
  },

  // [PATCH] /admin/api/don-hang/:id/trang-thai
  capNhatTrangThai: async (req, res) => {
    try {
      const { id } = req.params;
      const { trangThaiDonHang, trangThaiThanhToan, lyDoHuy } = req.body;
      const don = await donHangService.capNhatTrangThai(id, {
        trangThaiDonHang,
        trangThaiThanhToan,
        lyDoHuy,
      });
      return guiPhanHoiThanhCong(res, 200, "Đã cập nhật trạng thái đơn hàng thành công!", don);
    } catch (error) {
      return guiPhanHoiLoi(res, 400, error.message || "Lỗi cập nhật trạng thái đơn hàng", error.message);
    }
  },
};

module.exports = {
  sanPhamApi,
  danhMucApi,
  khuyenMaiApi,
  nguoiDungApi,
  donHangApi,
};
