// Controller Admin: Quản lý Danh mục món ăn ChipChip
const danhMucService = require("../../services/danh-muc.service");
const { dinhDangNgay } = require("../../utils/dinh-dang.util");

/**
 * [GET] /admin/danh-muc
 * Danh sách danh mục
 */
const index = async (req, res) => {
  try {
    const danhSach = await danhMucService.layTatCa();

    res.render("admin/pages/danh-muc/index", {
      title: "Quản lý danh mục - ChipChip Admin",
      activeMenu: "danh-muc",
      danhMucList: danhSach,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi danh sách danh mục:", error);
    res.redirect("/admin?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/danh-muc/them-moi
 * Giao diện thêm danh mục
 */
const renderThemMoi = (req, res) => {
  res.render("admin/pages/danh-muc/them-moi", {
    title: "Thêm danh mục mới - ChipChip Admin",
    activeMenu: "danh-muc",
    loi: req.query.loi || null,
  });
};

/**
 * [POST] /admin/danh-muc/them-moi
 * Xử lý thêm mới danh mục
 */
const xuLiThemMoi = async (req, res) => {
  try {
    await danhMucService.taoMoi(req.body);
    res.redirect("/admin/danh-muc?thongBao=" + encodeURIComponent("Thêm danh mục mới thành công!"));
  } catch (error) {
    console.error("Lỗi tạo danh mục:", error);
    res.redirect("/admin/danh-muc/them-moi?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/danh-muc/chinh-sua/:id
 * Giao diện chỉnh sửa danh mục
 */
const renderChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    const danhMuc = await danhMucService.layTheoId(id);

    if (!danhMuc) {
      return res.redirect("/admin/danh-muc?loi=" + encodeURIComponent("Không tìm thấy danh mục!"));
    }

    res.render("admin/pages/danh-muc/chinh-sua", {
      title: `Chỉnh sửa danh mục: ${danhMuc.tenDanhMuc} - ChipChip Admin`,
      activeMenu: "danh-muc",
      danhMuc,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi giao diện sửa danh mục:", error);
    res.redirect("/admin/danh-muc?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/danh-muc/chinh-sua/:id
 * Xử lý lưu cập nhật danh mục
 */
const xuLiChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    await danhMucService.capNhat(id, req.body);
    res.redirect("/admin/danh-muc?thongBao=" + encodeURIComponent("Cập nhật danh mục thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật danh mục:", error);
    res.redirect(`/admin/danh-muc/chinh-sua/${req.params.id}?loi=` + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/danh-muc/xoa/:id
 * Xử lý xóa danh mục
 */
const xuLiXoa = async (req, res) => {
  try {
    const { id } = req.params;
    await danhMucService.xoa(id);
    res.redirect("/admin/danh-muc?thongBao=" + encodeURIComponent("Đã xóa danh mục thành công!"));
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error);
    res.redirect("/admin/danh-muc?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/danh-muc/doi-trang-thai/:id
 * Đổi trạng thái hiển thị / ẩn danh mục
 */
const xuLiDoiTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;
    const dm = await danhMucService.doiTrangThai(id, trangThai);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.json({ success: true, message: "Đã cập nhật trạng thái danh mục!", data: dm });
    }
    res.redirect("/admin/danh-muc?thongBao=" + encodeURIComponent("Đã thay đổi trạng thái danh mục!"));
  } catch (error) {
    console.error("Lỗi đổi trạng thái danh mục:", error);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect("/admin/danh-muc?loi=" + encodeURIComponent(error.message));
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

