// Controller Admin: Tổng Quan / Dashboard
const thongKeService = require("../../services/thong-ke.service");
const { dinhDangTien, dinhDangNgay } = require("../../utils/dinh-dang.util");

const index = async (req, res) => {
  try {
    const duLieuThongKe = await thongKeService.layTongQuan();

    res.render("admin/pages/tong-quan/index", {
      title: "Bảng điều khiển - ChipChip Admin",
      activeMenu: "tong-quan",
      thongKe: duLieuThongKe,
      dinhDangTien,
      dinhDangNgay,
      thongBao: req.query.thongBao || null,
    });
  } catch (error) {
    console.error("Lỗi trang tổng quan admin:", error);
    res.status(500).render("pages/auth/khong-co-quyen", {
      title: "Lỗi hệ thống",
      message: "Có lỗi khi tải dữ liệu trang tổng quan: " + error.message,
    });
  }
};

module.exports = {
  index,
};
