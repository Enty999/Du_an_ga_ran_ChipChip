// Controller Admin: Quản lý Món ăn / Sản phẩm ChipChip
const sanPhamService = require("../../services/san-pham.service");
const danhMucService = require("../../services/danh-muc.service");
const { dinhDangTien, dinhDangNgay } = require("../../utils/dinh-dang.util");

/**
 * [GET] /admin/san-pham
 * Danh sách món ăn
 */
const index = async (req, res) => {
  try {
    const { tuKhoa, maDanhMuc, trangThai, trang } = req.query;

    const [ketQua, danhSachDanhMuc] = await Promise.all([
      sanPhamService.layDanhSach({
        tuKhoa,
        maDanhMuc,
        trangThai,
        trang: trang || 1,
        gioiHan: 10,
      }),
      danhMucService.layTatCa(),
    ]);

    res.render("admin/pages/san-pham/index", {
      title: "Quản lý món ăn - ChipChip Admin",
      activeMenu: "san-pham",
      sanPham: ketQua.danhSach,
      tongSo: ketQua.tongSo,
      tongSoTrang: ketQua.tongSoTrang,
      trangHienTai: ketQua.trangHienTai,
      danhMucList: danhSachDanhMuc,
      boLoc: {
        tuKhoa: tuKhoa || "",
        maDanhMuc: maDanhMuc || "tat-ca",
        trangThai: trangThai || "tat-ca",
      },
      dinhDangTien,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi danh sách sản phẩm:", error);
    res.redirect("/admin?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/san-pham/them-moi
 * Giao diện thêm món ăn mới
 */
const renderThemMoi = async (req, res) => {
  try {
    const danhSachDanhMuc = await danhMucService.layTatCa();

    res.render("admin/pages/san-pham/them-moi", {
      title: "Thêm món ăn mới - ChipChip Admin",
      activeMenu: "san-pham",
      danhMucList: danhSachDanhMuc,
      dinhDangTien,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi giao diện thêm món:", error);
    res.redirect("/admin/san-pham?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/san-pham/them-moi
 * Xử lý lưu món ăn mới
 */
const xuLiThemMoi = async (req, res) => {
  try {
    await sanPhamService.taoMoi(req.body);
    res.redirect("/admin/san-pham?thongBao=" + encodeURIComponent("Thêm món ăn mới thành công!"));
  } catch (error) {
    console.error("Lỗi thêm món ăn:", error);
    res.redirect("/admin/san-pham/them-moi?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/san-pham/chinh-sua/:id
 * Giao diện chỉnh sửa món ăn
 */
const renderChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    const [monAn, danhSachDanhMuc] = await Promise.all([
      sanPhamService.layTheoId(id),
      danhMucService.layTatCa(),
    ]);

    if (!monAn) {
      return res.redirect("/admin/san-pham?loi=" + encodeURIComponent("Không tìm thấy món ăn!"));
    }

    res.render("admin/pages/san-pham/chinh-sua", {
      title: `Chỉnh sửa: ${monAn.tenSanPham} - ChipChip Admin`,
      activeMenu: "san-pham",
      monAn,
      danhMucList: danhSachDanhMuc,
      dinhDangTien,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi giao diện sửa món:", error);
    res.redirect("/admin/san-pham?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/san-pham/chinh-sua/:id
 * Xử lý lưu cập nhật món ăn
 */
const xuLiChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    await sanPhamService.capNhat(id, req.body);
    res.redirect("/admin/san-pham?thongBao=" + encodeURIComponent("Cập nhật món ăn thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật món ăn:", error);
    res.redirect(`/admin/san-pham/chinh-sua/${req.params.id}?loi=` + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/san-pham/xoa/:id
 * Xử lý xóa món ăn
 */
const xuLiXoa = async (req, res) => {
  try {
    const { id } = req.params;
    await sanPhamService.xoa(id);
    res.redirect("/admin/san-pham?thongBao=" + encodeURIComponent("Đã xóa món ăn thành công!"));
  } catch (error) {
    console.error("Lỗi xóa món ăn:", error);
    res.redirect("/admin/san-pham?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/san-pham/doi-trang-thai/:id
 * Đổi nhanh trạng thái món ăn (Đang bán / Hết hàng / Ngừng bán)
 */
const xuLiDoiTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;
    const sp = await sanPhamService.doiTrangThai(id, trangThai);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.json({ success: true, message: "Đã cập nhật trạng thái món ăn!", data: sp });
    }
    res.redirect("/admin/san-pham?thongBao=" + encodeURIComponent("Đã cập nhật trạng thái món ăn!"));
  } catch (error) {
    console.error("Lỗi đổi trạng thái:", error);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect("/admin/san-pham?loi=" + encodeURIComponent(error.message));
  }
};

module.exports = {
  index,
  renderThemMoi,
  xuLiThemMoi,
  renderChinhSua,
  xuLiChinhSua,
  xuLiXoa,
  xuLiDoiTrangThai,
};

