// Service Đơn Hàng: Xử lý nghiệp vụ đặt món và quản lý đơn hàng ChipChip
const DonHang = require("../models/don-hang.model");
const SanPham = require("../models/san-pham.model");
const { taoMaDonHang } = require("../utils/dinh-dang.util");

class DonHangService {
  /**
   * Lấy danh sách đơn hàng có tìm kiếm và phân trang
   */
  async layDanhSach({
    tuKhoa = "",
    trangThaiDonHang = "",
    trangThaiThanhToan = "",
    maNguoiDung = "",
    trang = 1,
    gioiHan = 10,
    sapXep = { createdAt: -1 },
  } = {}) {
    const dieuKien = {};

    // Tìm kiếm theo mã đơn, họ tên, hoặc số điện thoại
    if (tuKhoa && tuKhoa.trim() !== "") {
      const reg = new RegExp(tuKhoa.trim(), "i");
      dieuKien.$or = [
        { maDonHang: reg },
        { "thongTinNguoiNhan.hoTen": reg },
        { "thongTinNguoiNhan.soDienThoai": reg },
      ];
    }

    if (trangThaiDonHang && trangThaiDonHang !== "tat-ca") {
      dieuKien.trangThaiDonHang = trangThaiDonHang;
    }

    if (trangThaiThanhToan && trangThaiThanhToan !== "tat-ca") {
      dieuKien.trangThaiThanhToan = trangThaiThanhToan;
    }

    if (maNguoiDung) {
      dieuKien.maNguoiDung = maNguoiDung;
    }

    const tongSo = await DonHang.countDocuments(dieuKien);
    const tongSoTrang = Math.ceil(tongSo / gioiHan) || 1;
    const trangHienTai = Math.max(1, Math.min(Number(trang), tongSoTrang));
    const boQua = (trangHienTai - 1) * gioiHan;

    const danhSach = await DonHang.find(dieuKien)
      .populate("maNguoiDung", "hoTen email SDT")
      .sort(sapXep)
      .skip(boQua)
      .limit(gioiHan)
      .lean();

    return {
      danhSach,
      tongSo,
      tongSoTrang,
      trangHienTai,
      gioiHan,
    };
  }

  /**
   * Lấy chi tiết đơn hàng theo ID
   */
  async layTheoId(id) {
    return await DonHang.findById(id)
      .populate("maNguoiDung", "hoTen email SDT")
      .populate("danhSachMon.maSanPham", "tenSanPham hinhAnh slug")
      .lean();
  }

  /**
   * Cập nhật trạng thái đơn hàng và thanh toán
   */
  async capNhatTrangThai(id, { trangThaiDonHang, trangThaiThanhToan, lyDoHuy }) {
    const capNhat = {};
    if (trangThaiDonHang) capNhat.trangThaiDonHang = trangThaiDonHang;
    if (trangThaiThanhToan) capNhat.trangThaiThanhToan = trangThaiThanhToan;
    if (lyDoHuy !== undefined) capNhat.lyDoHuy = lyDoHuy.trim();

    // Nếu trạng thái là "da-giao" và phương thức là tiền mặt, tự động đánh dấu đã thanh toán
    if (trangThaiDonHang === "da-giao") {
      capNhat.trangThaiThanhToan = "da-thanh-toan";
    }

    return await DonHang.findByIdAndUpdate(id, capNhat, { new: true });
  }

  /**
   * Tạo đơn hàng mới từ giỏ hàng / form đặt hàng
   */
  async taoDonHang({
    maNguoiDung = null,
    thongTinNguoiNhan,
    danhSachMon,
    phiVanChuyen = 15000,
    maGiamGia = "",
    tienGiamGia = 0,
    phuongThucThanhToan = "tien-mat",
  }) {
    // Tính tổng tiền các món
    let tongTienMon = 0;
    const danhSachChiTiet = [];

    for (const item of danhSachMon) {
      const sp = await SanPham.findById(item.maSanPham);
      if (!sp) {
        throw new Error(`Sản phẩm với ID ${item.maSanPham} không tồn tại`);
      }
      const giaBan = (sp.giaKhuyenMai && sp.giaKhuyenMai > 0) ? sp.giaKhuyenMai : sp.giaGoc;
      const thanhTien = giaBan * item.soLuong;
      tongTienMon += thanhTien;

      danhSachChiTiet.push({
        maSanPham: sp._id,
        tenSanPham: sp.tenSanPham,
        hinhAnh: sp.hinhAnh,
        gia: giaBan,
        soLuong: item.soLuong,
        thanhTien,
      });

      // Tăng số lượng đã bán
      await SanPham.findByIdAndUpdate(sp._id, {
        $inc: { daBan: item.soLuong, soLuongTon: -item.soLuong },
      });
    }

    const tongThanhToan = Math.max(0, tongTienMon + Number(phiVanChuyen) - Number(tienGiamGia));
    const maDon = taoMaDonHang();

    return await DonHang.create({
      maDonHang: maDon,
      maNguoiDung,
      thongTinNguoiNhan,
      danhSachMon: danhSachChiTiet,
      tongTienMon,
      phiVanChuyen,
      maGiamGia,
      tienGiamGia,
      tongThanhToan,
      phuongThucThanhToan,
      trangThaiThanhToan: "chua-thanh-toan",
      trangThaiDonHang: "cho-xac-nhan",
    });
  }

  /**
   * Xóa đơn hàng (chỉ quản trị viên cấp cao)
   */
  async xoa(id) {
    return await DonHang.findByIdAndDelete(id);
  }
}

module.exports = new DonHangService();
