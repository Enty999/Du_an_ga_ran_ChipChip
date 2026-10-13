// Controller Admin: Quản lý Đơn hàng gà rán ChipChip
const donHangService = require("../../services/don-hang.service");
const { dinhDangTien, dinhDangNgay } = require("../../utils/dinh-dang.util");

/**
 * [GET] /admin/don-hang
 * Danh sách đơn hàng
 */
const index = async (req, res) => {
  try {
    const { tuKhoa, trangThaiDonHang, trangThaiThanhToan, trang } = req.query;

    const ketQua = await donHangService.layDanhSach({
      tuKhoa,
      trangThaiDonHang,
      trangThaiThanhToan,
      trang: trang || 1,
      gioiHan: 10,
    });

    res.render("admin/pages/don-hang/index", {
      title: "Quản lý đơn hàng - ChipChip Admin",
      activeMenu: "don-hang",
      donHangList: ketQua.danhSach,
      tongSo: ketQua.tongSo,
      tongSoTrang: ketQua.tongSoTrang,
      trangHienTai: ketQua.trangHienTai,
      boLoc: {
        tuKhoa: tuKhoa || "",
        trangThaiDonHang: trangThaiDonHang || "tat-ca",
        trangThaiThanhToan: trangThaiThanhToan || "tat-ca",
      },
      dinhDangTien,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi danh sách đơn hàng:", error);
    res.redirect("/admin?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [GET] /admin/don-hang/chi-tiet/:id
 * Chi tiết đơn hàng
 */
const chiTiet = async (req, res) => {
  try {
    const { id } = req.params;
    const donHang = await donHangService.layTheoId(id);

    if (!donHang) {
      return res.redirect("/admin/don-hang?loi=" + encodeURIComponent("Không tìm thấy đơn hàng!"));
    }

    res.render("admin/pages/don-hang/chi-tiet", {
      title: `Đơn hàng #${donHang.maDonHang} - ChipChip Admin`,
      activeMenu: "don-hang",
      donHang,
      dinhDangTien,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
      loi: req.query.loi || null,
    });
  } catch (error) {
    console.error("Lỗi chi tiết đơn hàng:", error);
    res.redirect("/admin/don-hang?loi=" + encodeURIComponent(error.message));
  }
};

/**
 * [POST] /admin/don-hang/cap-nhat-trang-thai/:id
 * Cập nhật trạng thái đơn hàng và trạng thái thanh toán
 */
const xuLiCapNhatTrangThai = async (req, res) => {
  try {
    const { id } = req.params;
    const { trangThaiDonHang, trangThaiThanhToan, lyDoHuy } = req.body;

    const don = await donHangService.capNhatTrangThai(id, {
      trangThaiDonHang,
      trangThaiThanhToan,
      lyDoHuy,
    });

    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công!", data: don });
    }

    const referer = req.get("Referer") || "";
    if (referer.includes("/chi-tiet")) {
      return res.redirect(`/admin/don-hang/chi-tiet/${id}?thongBao=` + encodeURIComponent("Cập nhật trạng thái đơn hàng thành công!"));
    }
    res.redirect(`/admin/don-hang?thongBao=` + encodeURIComponent("Cập nhật trạng thái đơn hàng thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    if (req.xhr || req.headers.accept?.includes("application/json") || req.body.isAjax) {
      return res.status(500).json({ success: false, message: error.message });
    }
    res.redirect(`/admin/don-hang?loi=` + encodeURIComponent(error.message));
  }
};

module.exports = {
  index,
  chiTiet,
  xuLiCapNhatTrangThai,
};
