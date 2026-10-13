// Controller Admin: Quản lý Khuyến mãi & Voucher ChipChip
const khuyenMaiService = require("../../services/khuyen-mai.service");
const { dinhDangTien, dinhDangNgay } = require("../../utils/dinh-dang.util");

/**
 * [GET] /admin/khuyen-mai
 * Danh sách khuyến mãi
 */
const index = async (req, res) => {
  try {
    const danhSach = await khuyenMaiService.layDanhSach();

    res.render("admin/pages/khuyen-mai/index", {
      title: "Quản lý khuyến mãi - ChipChip Admin",
      activeMenu: "khuyen-mai",
      khuyenMaiList: danhSach,
      dinhDangTien,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi danh sách khuyến mãi:", error);
    res.redirect("/admin?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/khuyen-mai/them-moi
 * Giao diện thêm mã khuyến mãi
 */
const renderThemMoi = (req, res) => {
  res.render("admin/pages/khuyen-mai/them-moi", {
    title: "Tạo mã khuyến mãi mới - ChipChip Admin",
    activeMenu: "khuyen-mai",
    loi: req.query.loi || null,
  });
};

/**
 * [POST] /admin/khuyen-mai/them-moi
 * Xử lý thêm mã khuyến mãi
 */
const xuLiThemMoi = async (req, res) => {
  try {
    await khuyenMaiService.taoMoi(req.body);
    res.redirect("/admin/khuyen-mai?thongBao=" + encodeURIComponent("Tạo mã khuyến mãi mới thành công!"));
  } catch (error) {
    console.error("Lỗi tạo khuyến mãi:", error);
    res.redirect("/admin/khuyen-mai/them-moi?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/khuyen-mai/chinh-sua/:id
 * Giao diện chỉnh sửa khuyến mãi
 */
const renderChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    const khuyenMai = await khuyenMaiService.layTheoId(id);

    if (!khuyenMai) {
      return res.redirect("/admin/khuyen-mai?loi=" + encodeURIComponent("Không tìm thấy mã khuyến mãi!"));
    }

    res.render("admin/pages/khuyen-mai/chinh-sua", {
      title: `Chỉnh sửa: ${khuyenMai.maCode} - ChipChip Admin`,
      activeMenu: "khuyen-mai",
      khuyenMai,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi giao diện sửa khuyến mãi:", error);
    res.redirect("/admin/khuyen-mai?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/khuyen-mai/chinh-sua/:id
 * Xử lý cập nhật khuyến mãi
 */
const xuLiChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    await khuyenMaiService.capNhat(id, req.body);
    res.redirect("/admin/khuyen-mai?thongBao=" + encodeURIComponent("Cập nhật khuyến mãi thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật khuyến mãi:", error);
    res.redirect(`/admin/khuyen-mai/chinh-sua/${req.params.id}?loi=` + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/khuyen-mai/xoa/:id
 * Xử lý xóa khuyến mãi
 */
const xuLiXoa = async (req, res) => {
  try {
    const { id } = req.params;
    await khuyenMaiService.xoa(id);
    res.redirect("/admin/khuyen-mai?thongBao=" + encodeURIComponent("Đã xóa mã khuyến mãi thành công!"));
  } catch (error) {
    console.error("Lỗi xóa khuyến mãi:", error);
    res.redirect("/admin/khuyen-mai?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/khuyen-mai/doi-trang-thai/:id
 * Đổi trạng thái mã khuyến mãi nhanh
 */
const xuLiDoiTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;
    const km = await khuyenMaiService.doiTrangThai(id, trangThai);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.json({ success: true, message: "Đã cập nhật trạng thái voucher!", data: km });
    }
    res.redirect("/admin/khuyen-mai?thongBao=" + encodeURIComponent("Đã thay đổi trạng thái khuyến mãi!"));
  } catch (error) {
    console.error("Lỗi đổi trạng thái khuyến mãi:", error);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect("/admin/khuyen-mai?loi=" + encodeURIComponent(error.message));
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

