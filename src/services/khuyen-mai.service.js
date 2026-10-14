// Service Khuyến Mãi: Xử lý mã giảm giá / voucher khuyến mãi ChipChip
const KhuyenMai = require("../models/khuyen-mai.model");

class KhuyenMaiService {
  /**
   * Lấy danh sách khuyến mãi
   */
  async layDanhSach(dieuKien = {}, sapXep = { createdAt: -1 }) {
    return await KhuyenMai.find(dieuKien).sort(sapXep).lean();
  }

  /**
   * Lấy chi tiết khuyến mãi theo ID
   */
  async layTheoId(id) {
    return await KhuyenMai.findById(id).lean();
  }

  /**
   * Lấy theo mã code
   */
  async layTheoCode(maCode) {
    if (!maCode) return null;
    return await KhuyenMai.findOne({
      maCode: maCode.trim().toUpperCase(),
      trangThai: "hoat-dong",
    }).lean();
  }

  /**
   * Thêm khuyến mãi mới
   */
  async taoMoi(duLieu) {
    const {
      maCode,
      tieuDe,
      moTa,
      loaiGiamGia,
      giaTriGiam,
      giamToiDa,
      donHangToiThieu,
      soLuong,
      ngayKetThuc,
      trangThai,
    } = duLieu;

    const codeUpper = maCode.trim().toUpperCase();
    const tonTai = await KhuyenMai.findOne({ maCode: codeUpper });
    if (tonTai) {
      throw new Error(`Mã khuyến mãi '${codeUpper}' đã tồn tại!`);
    }

    return await KhuyenMai.create({
      maCode: codeUpper,
      tieuDe: tieuDe.trim(),
      moTa: moTa ? moTa.trim() : "",
      loaiGiamGia: loaiGiamGia || "phan-tram",
      giaTriGiam: Number(giaTriGiam),
      giamToiDa: Number(giamToiDa) || 0,
      donHangToiThieu: Number(donHangToiThieu) || 0,
      soLuong: Number(soLuong) || 100,
      ngayKetThuc: ngayKetThuc ? new Date(ngayKetThuc) : null,
      trangThai: trangThai || "hoat-dong",
    });
  }

  /**
   * Cập nhật khuyến mãi
   */
  async capNhat(id, duLieu) {
    const {
      tieuDe,
      moTa,
      loaiGiamGia,
      giaTriGiam,
      giamToiDa,
      donHangToiThieu,
      soLuong,
      ngayKetThuc,
      trangThai,
    } = duLieu;

    return await KhuyenMai.findByIdAndUpdate(
      id,
      {
        ...(tieuDe && { tieuDe: tieuDe.trim() }),
        ...(moTa !== undefined && { moTa: moTa.trim() }),
        ...(loaiGiamGia && { loaiGiamGia }),
        ...(giaTriGiam !== undefined && { giaTriGiam: Number(giaTriGiam) }),
        ...(giamToiDa !== undefined && { giamToiDa: Number(giamToiDa) }),
        ...(donHangToiThieu !== undefined && { donHangToiThieu: Number(donHangToiThieu) }),
        ...(soLuong !== undefined && { soLuong: Number(soLuong) }),
        ...(ngayKetThuc !== undefined && { ngayKetThuc: ngayKetThuc ? new Date(ngayKetThuc) : null }),
        ...(trangThai && { trangThai }),
      },
      { returnDocument: "after", runValidators: true }
    );
  }

  /**
   * Xóa khuyến mãi
   */
  async xoa(id) {
    return await KhuyenMai.findByIdAndDelete(id);
  }

  /**
   * Đổi trạng thái nhanh voucher (hoat-dong / tam-dung / het-han)
   */
  async doiTrangThai(id, trangThaiMoi) {
    return await KhuyenMai.findByIdAndUpdate(
      id,
      { trangThai: trangThaiMoi },
      { returnDocument: "after" }
    );
  }
}

module.exports = new KhuyenMaiService();

