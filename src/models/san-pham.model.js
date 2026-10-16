const mongoose = require("mongoose");

const soDoSanPham = new mongoose.Schema(
  {
    tenSanPham: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    maDanhMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanhMuc"
    },
    giaGoc: {
      type: Number,
      required: true
    },
    giaKhuyenMai: {
      type: Number,
      default: 0
    },
    khauPhan: {
      type: String,
      default: ""
    },
    tenTiengAnh: {
      type: String,
      default: ""
    },
    moTa: {
      type: String,
      default: ""
    },
    hinhAnh: {
      type: String,
      default: ""
    },
    huyHieu: {
      type: String,
      default: ""
    },
    loaiHuyHieu: {
      type: String,
      default: "secondary"
    },
    noiBat: {
      type: Boolean,
      default: false
    },
    banChay: {
      type: Boolean,
      default: false
    },
    soLuongTon: {
      type: Number,
      default: 100
    },
    daBan: {
      type: Number,
      default: 0
    },
    trangThai: {
      type: String,
      default: "dang-ban"
    },
  },
  { timestamps: true }
);

// Tham số thứ 3 là "sanphams" đảm bảo Mongoose trỏ CHÍNH XÁC vào collection có sẵn trên Atlas
module.exports = mongoose.model("SanPham", soDoSanPham, "sanphams");
