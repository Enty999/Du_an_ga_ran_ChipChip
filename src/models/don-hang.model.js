// Model DonHang (Đơn hàng gà rán ChipChip)
const mongoose = require("mongoose");

// Lược đồ chi tiết từng món trong đơn
const soDoMonTrongDon = new mongoose.Schema(
  {
    maSanPham: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SanPham",
      required: true,
    },
    tenSanPham: {
      type: String,
      required: true,
    },
    hinhAnh: {
      type: String,
      default: "",
    },
    gia: {
      type: Number,
      required: true,
    },
    soLuong: {
      type: Number,
      required: true,
      min: [1, "Số lượng món tối thiểu là 1"],
    },
    thanhTien: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// Lược đồ Đơn Hàng tổng
const soDoDonHang = new mongoose.Schema(
  {
    // Mã đơn hàng độc nhất (Ví dụ: CC-261013-8899)
    maDonHang: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // Tài khoản đặt hàng (nếu có đăng nhập)
    maNguoiDung: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NguoiDung",
      default: null,
    },
    // Thông tin nhận hàng của khách
    thongTinNguoiNhan: {
      hoTen: {
        type: String,
        required: [true, "Vui lòng nhập tên người nhận"],
        trim: true,
      },
      soDienThoai: {
        type: String,
        required: [true, "Vui lòng nhập số điện thoại"],
        trim: true,
      },
      email: {
        type: String,
        trim: true,
        default: "",
      },
      diaChi: {
        type: String,
        required: [true, "Vui lòng nhập địa chỉ nhận hàng"],
        trim: true,
      },
      ghiChu: {
        type: String,
        trim: true,
        default: "",
      },
    },
    // Danh sách các món ăn đã chọn
    danhSachMon: [soDoMonTrongDon],
    // Tổng tiền các món
    tongTienMon: {
      type: Number,
      required: true,
      min: 0,
    },
    // Phí vận chuyển (Mặc định 15.000đ)
    phiVanChuyen: {
      type: Number,
      default: 15000,
    },
    // Mã giảm giá áp dụng (nếu có)
    maGiamGia: {
      type: String,
      default: "",
      trim: true,
    },
    // Số tiền được giảm giá
    tienGiamGia: {
      type: Number,
      default: 0,
    },
    // Tổng số tiền thanh toán thực tế (tongTienMon + phiVanChuyen - tienGiamGia)
    tongThanhToan: {
      type: Number,
      required: true,
      min: 0,
    },
    // Phương thức thanh toán
    phuongThucThanhToan: {
      type: String,
      enum: ["tien-mat", "chuyen-khoan", "momo", "vnpay"],
      default: "tien-mat",
    },
    // Trạng thái thanh toán
    trangThaiThanhToan: {
      type: String,
      enum: ["chua-thanh-toan", "da-thanh-toan"],
      default: "chua-thanh-toan",
    },
    // Trạng thái xử lý và giao đơn hàng:
    // "cho-xac-nhan"  -> Đơn mới
    // "da-xac-nhan"   -> Cửa hàng đã tiếp nhận
    // "dang-che-bien" -> Bếp đang chiên gà
    // "dang-giao"     -> Shipper đang trên đường giao
    // "da-giao"       -> Đã giao thành công
    // "da-huy"        -> Đơn đã bị hủy
    trangThaiDonHang: {
      type: String,
      enum: [
        "cho-xac-nhan",
        "da-xac-nhan",
        "dang-che-bien",
        "dang-giao",
        "da-giao",
        "da-huy",
      ],
      default: "cho-xac-nhan",
    },
    // Lý do hủy đơn (nếu có)
    lyDoHuy: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DonHang", soDoDonHang);
