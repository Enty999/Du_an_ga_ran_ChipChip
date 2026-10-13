// Controller Tài Khoản: Quản lý thông tin cá nhân và đơn hàng của khách hàng
const nguoiDungService = require("../services/nguoi-dung.service");
const donHangService = require("../services/don-hang.service");
const { dinhDangTien, dinhDangNgay } = require("../utils/dinh-dang.util");

/**
 * [GET] /tai-khoan
 * Xem thông tin cá nhân và địa chỉ nhận hàng
 */
const renderThongTin = (req, res) => {
  res.render("pages/tai-khoan/thong-tin", {
    title: "Thông tin tài khoản",
    message: req.query.message || null,
  });
};

/**
 * [POST] /tai-khoan/cap-nhat
 * Lưu thông tin giao hàng cá nhân
 */
const xuLiCapNhatThongTin = async (req, res) => {
  try {
    const nguoiDungId = res.locals.nguoiDung._id;
    const { hoTen, SDT, diaChi, ghiChuGiaoHang } = req.body;

    await nguoiDungService.capNhat(nguoiDungId, {
      hoTen,
      SDT,
      diaChi,
      ghiChuGiaoHang,
    });

    res.redirect("/tai-khoan?message=" + encodeURIComponent("Cập nhật thông tin nhận hàng thành công!"));
  } catch (error) {
    console.error("Lỗi cập nhật thông tin tài khoản:", error);
    res.redirect("/tai-khoan?message=" + encodeURIComponent("Có lỗi xảy ra: " + error.message));
  }
};

/**
 * [GET] /tai-khoan/don-hang
 * Xem lịch sử đơn hàng của chính tài khoản này
 */
const renderDonHang = async (req, res) => {
  try {
    const nguoiDungId = res.locals.nguoiDung._id;
    const ketQua = await donHangService.layDanhSach({
      maNguoiDung: nguoiDungId,
      gioiHan: 50,
    });

    res.render("pages/tai-khoan/don-hang", {
      title: "Đơn hàng của tôi",
      donHangList: ketQua.danhSach,
      dinhDangTien,
      dinhDangNgay,
    });
  } catch (error) {
    console.error("Lỗi tải lịch sử đơn hàng:", error);
    res.render("pages/tai-khoan/don-hang", {
      title: "Đơn hàng của tôi",
      donHangList: [],
      dinhDangTien,
      dinhDangNgay,
    });
  }
};

module.exports = {
  renderThongTin,
  xuLiCapNhatThongTin,
  renderDonHang,
};
