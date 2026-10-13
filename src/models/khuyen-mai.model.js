// Model KhuyenMai (Mã giảm giá / Khuyến mãi ChipChip)
const mongoose = require("mongoose");

// Cấu trúc Schema cho Khuyến Mãi
const soDoKhuyenMai = new mongoose.Schema(
  {
    // Mã code khách hàng nhập (Ví dụ: CHIPCHIPHE, GIAM20K, FREESHIP)
    maCode: {
      type: String,
      required: [true, "Vui lòng nhập mã code"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    // Tiêu đề chương trình ưu đãi
    tieuDe: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề khuyến mãi"],
      trim: true,
    },
    // Mô tả chi tiết điều kiện áp dụng
    moTa: {
      type: String,
      default: "",
      trim: true,
    },
    // Loại giảm: "phan-tram" (ví dụ 15%) hoặc "tien-mat" (ví dụ 30.000đ)
    loaiGiamGia: {
      type: String,
      enum: ["phan-tram", "tien-mat"],
      default: "phan-tram",
    },
    // Giá trị giảm (số % hoặc số tiền VNĐ)
    giaTriGiam: {
      type: Number,
      required: [true, "Vui lòng nhập giá trị giảm"],
      min: [1, "Giá trị giảm tối thiểu là 1"],
    },
    // Giảm tối đa (áp dụng khi loại là "phan-tram")
    giamToiDa: {
      type: Number,
      default: 0,
    },
    // Giá trị đơn hàng tối thiểu để được áp dụng
    donHangToiThieu: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Tổng số lượng mã phát hành
    soLuong: {
      type: Number,
      default: 100,
      min: 0,
    },
    // Số lượt đã sử dụng
    daSuDung: {
      type: Number,
      default: 0,
    },
    // Thời hạn hiệu lực
    ngayBatDau: {
      type: Date,
      default: Date.now,
    },
    ngayKetThuc: {
      type: Date,
    },
    // Trạng thái: "hoat-dong", "tam-dung", "het-han"
    trangThai: {
      type: String,
      enum: ["hoat-dong", "tam-dung", "het-han"],
      default: "hoat-dong",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("KhuyenMai", soDoKhuyenMai);
