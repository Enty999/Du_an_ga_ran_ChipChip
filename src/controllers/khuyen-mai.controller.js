// Controller Khuyến Mãi (Phía Khách Hàng)
const KhuyenMai = require("../models/khuyen-mai.model");

class KhuyenMaiController {
  /**
   * [GET] /khuyen-mai -> Hiển thị danh sách các mã ưu đãi đang áp dụng
   */
  async renderTrangKhuyenMai(req, res) {
    try {
      const homNay = new Date();

      // Lấy các mã khuyến mãi đang 'hoat-dong' và còn hạn sử dụng
      const danhSachKhuyenMai = await KhuyenMai.find({
        trangThai: "hoat-dong",
        $or: [
          { ngayKetThuc: null },
          { ngayKetThuc: { $exists: false } },
          { ngayKetThuc: { $gte: homNay } },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();

      res.render("pages/khuyen-mai/khuyen-mai", {
        title: "Ưu Đãi & Khuyến Mãi - Gà Rán ChipChip",
        danhSachKhuyenMai,
      });
    } catch (error) {
      console.error("[LỖI RENDER KHUYẾN MÃI]:", error);
      res.status(500).send("Có lỗi xảy ra khi tải trang khuyến mãi: " + error.message);
    }
  }
}

module.exports = new KhuyenMaiController();