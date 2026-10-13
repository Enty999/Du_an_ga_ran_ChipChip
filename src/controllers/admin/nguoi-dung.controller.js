// Controller Admin: Quản lý Người dùng & Phân quyền ChipChip
const nguoiDungService = require("../../services/nguoi-dung.service");
const { dinhDangNgay } = require("../../utils/dinh-dang.util");

/**
 * [GET] /admin/nguoi-dung
 * Danh sách người dùng
 */
const index = async (req, res) => {
  try {
    const { tuKhoa, vaiTro, trangThai, trang } = req.query;

    const ketQua = await nguoiDungService.layDanhSach({
      tuKhoa,
      vaiTro,
      trangThai,
      trang: trang || 1,
      gioiHan: 10,
    });

    res.render("admin/pages/nguoi-dung/index", {
      title: "Quản lý người dùng - ChipChip Admin",
      activeMenu: "nguoi-dung",
      nguoiDungList: ketQua.danhSach,
      tongSo: ketQua.tongSo,
      tongSoTrang: ketQua.tongSoTrang,
      trangHienTai: ketQua.trangHienTai,
      boLoc: {
        tuKhoa: tuKhoa || "",
        vaiTro: vaiTro || "tat-ca",
        trangThai: trangThai || "tat-ca",
      },
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi danh sách người dùng:", error);
    res.redirect("/admin?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/nguoi-dung/chinh-sua/:id
 * Giao diện xem và chỉnh sửa người dùng
 */
const renderChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await nguoiDungService.layTheoId(id);

    if (!user) {
      return res.redirect("/admin/nguoi-dung?loi=" + encodeURIComponent("Không tìm thấy người dùng!"));
    }

    res.render("admin/pages/nguoi-dung/chinh-sua", {
      title: `Chỉnh sửa: ${user.hoTen} - ChipChip Admin`,
      activeMenu: "nguoi-dung",
      user,
      dinhDangNgay,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi giao diện sửa người dùng:", error);
    res.redirect("/admin/nguoi-dung?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/nguoi-dung/chinh-sua/:id
 * Cập nhật thông tin & phân quyền người dùng
 */
const xuLiChinhSua = async (req, res) => {
  try {
    const { id } = req.params;
    await nguoiDungService.capNhat(id, req.body);
    res.redirect("/admin/nguoi-dung?thongBao=" + encodeURIComponent("Cập nhật thông tin tài khoản thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    res.redirect(`/admin/nguoi-dung/chinh-sua/${req.params.id}?loi=` + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/nguoi-dung/doi-trang-thai/:id
 * Khóa hoặc Mở khóa tài khoản nhanh
 */
const xuLiDoiTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThai } = req.body;
    const u = await nguoiDungService.doiTrangThai(id, trangThai);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.json({ success: true, message: "Đã thay đổi trạng thái tài khoản!", data: u });
    }
    res.redirect("/admin/nguoi-dung?thongBao=" + encodeURIComponent("Đã thay đổi trạng thái tài khoản!"));
  } catch (error) {
    console.error("Lỗi thay đổi trạng thái tài khoản:", error);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect("/admin/nguoi-dung?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/nguoi-dung/them-moi
 * Tạo mới tài khoản người dùng
 */
const xuLiThemMoi = async (req, res) => {
  try {
    await nguoiDungService.taoMoi(req.body);
    res.redirect("/admin/nguoi-dung?thongBao=" + encodeURIComponent("Tạo tài khoản người dùng mới thành công!"));
  } catch (error) {
    console.error("Lỗi thêm người dùng:", error);
    res.redirect("/admin/nguoi-dung?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/nguoi-dung/xoa/:id
 * Xóa tài khoản người dùng
 */
const xuLiXoa = async (req, res) => {
  try {
    const { id } = req.params;
    await nguoiDungService.xoa(id);
    res.redirect("/admin/nguoi-dung?thongBao=" + encodeURIComponent("Đã xóa tài khoản người dùng!"));
  } catch (error) {
    console.error("Lỗi xóa người dùng:", error);
    res.redirect("/admin/nguoi-dung?loi=" + encodeURIComponent(error.message));
  }
};

module.exports = {
  index,
  renderChinhSua,
  xuLiThemMoi,
  xuLiChinhSua,
  xuLiXoa,
  xuLiDoiTrangThai,
};

