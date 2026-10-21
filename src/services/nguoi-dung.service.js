// Service Người Dùng: Xử lý quản lý tài khoản và phân quyền khách hàng / admin
const NguoiDung = require("../models/nguoi-dung.model");
const bcrypt = require("bcryptjs");

class NguoiDungService {
  /**
   * Lấy danh sách người dùng với bộ lọc và phân trang
   */
  async layDanhSach({
    tuKhoa = "",
    vaiTro = "",
    trangThai = "",
    trang = 1,
    gioiHan = 10,
    sapXep = { createdAt: -1 },
  } = {}) {
    const dieuKien = {};

    if (tuKhoa && tuKhoa.trim() !== "") {
      const reg = new RegExp(tuKhoa.trim(), "i");
      dieuKien.$or = [{ hoTen: reg }, { email: reg }, { SDT: reg }];
    }

    if (vaiTro && vaiTro !== "tat-ca") {
      dieuKien.vaiTro = vaiTro;
    }

    if (trangThai && trangThai !== "tat-ca") {
      dieuKien.trangThai = trangThai;
    }

    const tongSo = await NguoiDung.countDocuments(dieuKien);
    const tongSoTrang = Math.ceil(tongSo / gioiHan) || 1;
    const trangHienTai = Math.max(1, Math.min(Number(trang), tongSoTrang));
    const boQua = (trangHienTai - 1) * gioiHan;

    const danhSach = await NguoiDung.find(dieuKien)
      .select("-password")
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
   * Lấy chi tiết người dùng theo ID
   */
  async layTheoId(id) {
    return await NguoiDung.findById(id).select("-password").lean();
  }

  /**
   * Cập nhật thông tin người dùng từ Admin hoặc trang cá nhân
   */
  async capNhat(id, duLieu) {
    const { hoTen, SDT, diaChi, ghiChuGiaoHang, vaiTro, trangThai, matKhauMoi, password, anhDaiDien } = duLieu;
    const capNhat = {};

    if (hoTen) capNhat.hoTen = hoTen.trim();
    if (SDT !== undefined) capNhat.SDT = SDT.trim();
    if (diaChi !== undefined) capNhat.diaChi = diaChi.trim();
    if (ghiChuGiaoHang !== undefined) capNhat.ghiChuGiaoHang = ghiChuGiaoHang.trim();
    if (vaiTro) capNhat.vaiTro = vaiTro;
    if (trangThai) capNhat.trangThai = trangThai;
    if (anhDaiDien !== undefined) capNhat.anhDaiDien = anhDaiDien.trim();

    // Hỗ trợ cập nhật/đổi mật khẩu an toàn
    const passMoi = matKhauMoi || password;
    if (passMoi && typeof passMoi === "string" && passMoi.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      capNhat.password = await bcrypt.hash(passMoi.trim(), salt);
    }

    return await NguoiDung.findByIdAndUpdate(id, capNhat, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");
  }

  /**
   * Đổi vai trò tài khoản (khach-hang, nhan-vien, admin)
   */
  async doiVaiTro(id, vaiTroMoi) {
    return await NguoiDung.findByIdAndUpdate(
      id,
      { vaiTro: vaiTroMoi },
      { returnDocument: "after" }
    ).select("-password");
  }

  /**
   * Khóa hoặc mở khóa tài khoản
   */
  async doiTrangThai(id, trangThaiMoi) {
    return await NguoiDung.findByIdAndUpdate(
      id,
      { trangThai: trangThaiMoi },
      { returnDocument: "after" }
    ).select("-password");
  }

  /**
   * Tạo tài khoản người dùng mới từ trang Admin
   */
  async taoMoi(duLieu) {
    const { hoTen, email, password, SDT, diaChi, ghiChuGiaoHang, vaiTro, trangThai, anhDaiDien } = duLieu;
    const tonTai = await NguoiDung.findOne({ email: email.toLowerCase().trim() });
    if (tonTai) {
      throw new Error("Email đã được sử dụng bởi tài khoản khác!");
    }
    const nguoiDungMoi = new NguoiDung({
      hoTen: hoTen.trim(),
      email: email.toLowerCase().trim(),
      password: password || "123456",
      SDT: SDT ? SDT.trim() : "",
      diaChi: diaChi ? diaChi.trim() : "",
      ghiChuGiaoHang: ghiChuGiaoHang ? ghiChuGiaoHang.trim() : "",
      vaiTro: vaiTro || "khach-hang",
      trangThai: trangThai || "hoat-dong",
      anhDaiDien: anhDaiDien ? anhDaiDien.trim() : "",
    });
    return await nguoiDungMoi.save();
  }

  /**
   * Xóa tài khoản người dùng
   */
  async xoa(id) {
    return await NguoiDung.findByIdAndDelete(id);
  }
}

module.exports = new NguoiDungService();

