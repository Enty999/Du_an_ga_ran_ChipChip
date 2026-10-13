// Service Thống Kê: Cung cấp số liệu tổng quan và báo cáo cho Dashboard Admin
const DonHang = require("../models/don-hang.model");
const SanPham = require("../models/san-pham.model");
const DanhMuc = require("../models/danh-muc.model");
const NguoiDung = require("../models/nguoi-dung.model");

class ThongKeService {
  /**
   * Lấy tổng quan các chỉ số kinh doanh chính (KPI Cards)
   */
  async layTongQuan() {
    // 1. Tổng đơn hàng
    const tongDonHang = await DonHang.countDocuments();
    const donChoXacNhan = await DonHang.countDocuments({ trangThaiDonHang: "cho-xac-nhan" });
    const donDangGiao = await DonHang.countDocuments({ trangThaiDonHang: "dang-giao" });
    const donHoanTat = await DonHang.countDocuments({ trangThaiDonHang: "da-giao" });
    const donDaHuy = await DonHang.countDocuments({ trangThaiDonHang: "da-huy" });

    // 2. Tổng doanh thu (Chỉ tính các đơn đã hoàn tất hoặc đã thanh toán)
    const ketQuaDoanhThu = await DonHang.aggregate([
      {
        $match: {
          trangThaiDonHang: { $ne: "da-huy" },
          $or: [
            { trangThaiThanhToan: "da-thanh-toan" },
            { trangThaiDonHang: "da-giao" },
          ],
        },
      },
      {
        $group: {
          _id: null,
          tongDoanhThu: { $sum: "$tongThanhToan" },
        },
      },
    ]);
    const tongDoanhThu = ketQuaDoanhThu.length > 0 ? ketQuaDoanhThu[0].tongDoanhThu : 0;

    // 3. Số lượng món ăn và danh mục
    const tongSanPham = await SanPham.countDocuments();
    const sanPhamDangBan = await SanPham.countDocuments({ trangThai: "dang-ban" });
    const sanPhamHetHang = await SanPham.countDocuments({ trangThai: "het-hang" });
    const tongDanhMuc = await DanhMuc.countDocuments();

    // 4. Số lượng khách hàng (vaiTro = khach-hang)
    const tongKhachHang = await NguoiDung.countDocuments({ vaiTro: "khach-hang" });
    const tongNguoiDung = await NguoiDung.countDocuments();

    // 5. 5 Đơn hàng mới nhất
    const donHangMoiNhat = await DonHang.find()
      .populate("maNguoiDung", "hoTen email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 6. Top 5 món bán chạy nhất
    const monBanChayNhat = await SanPham.find({ trangThai: { $ne: "ngung-ban" } })
      .populate("maDanhMuc", "tenDanhMuc")
      .sort({ daBan: -1 })
      .limit(5)
      .lean();

    // 7. Thống kê tỷ lệ trạng thái đơn hàng (Dùng vẽ biểu đồ Donut)
    const donutLabels = ["Chờ xác nhận", "Đang giao hàng", "Giao thành công", "Đã hủy"];
    const donutCounts = [donChoXacNhan, donDangGiao, donHoanTat, donDaHuy];
    const donutColors = ["#FFA726", "#42A5F5", "#66BB6A", "#EF5350"];

    // 8. Thống kê doanh thu & đơn hàng 7 ngày gần nhất (Dùng vẽ biểu đồ Đường Line Chart)
    const ngayHienTai = new Date();
    const bayNgayTruoc = new Date();
    bayNgayTruoc.setDate(ngayHienTai.getDate() - 6);
    bayNgayTruoc.setHours(0, 0, 0, 0);

    const doanhThu7Ngay = await DonHang.aggregate([
      {
        $match: {
          createdAt: { $gte: bayNgayTruoc },
          trangThaiDonHang: { $ne: "da-huy" },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d/%m", date: "$createdAt" } },
          doanhThu: { $sum: "$tongThanhToan" },
          soDon: { $sum: 1 },
        },
      },
    ]);

    const chartLabels = [];
    const chartRevenue = [];
    const chartOrders = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      chartLabels.push(label);
      const timNgay = doanhThu7Ngay.find((x) => x._id === label);
      chartRevenue.push(timNgay ? timNgay.doanhThu : 0);
      chartOrders.push(timNgay ? timNgay.soDon : 0);
    }

    // Nếu chưa có đơn hàng trong 7 ngày, đảm bảo hôm nay có số liệu tổng quan
    const tongChart = chartRevenue.reduce((a, b) => a + b, 0);
    if (tongChart === 0 && tongDoanhThu > 0) {
      chartRevenue[chartRevenue.length - 1] = tongDoanhThu;
      chartOrders[chartOrders.length - 1] = tongDonHang;
    }

    return {
      tongDoanhThu,
      tongDonHang,
      donChoXacNhan,
      donDangGiao,
      donHoanTat,
      donDaHuy,
      tongSanPham,
      sanPhamDangBan,
      sanPhamHetHang,
      tongDanhMuc,
      tongKhachHang,
      tongNguoiDung,
      donHangMoiNhat,
      monBanChayNhat,
      chartLabels,
      chartRevenue,
      chartOrders,
      donutLabels,
      donutCounts,
      donutColors,
    };
  }
}

module.exports = new ThongKeService();
