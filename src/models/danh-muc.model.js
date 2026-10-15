const mongoose = require("mongoose");

const soDoDanhMuc = new mongoose.Schema(
  {
    tenDanhMuc: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    moTa: String,
    bieuTuong: String,
    thuTu: { type: Number, default: 0 },
    trangThai: { type: String, default: "hien-thi" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DanhMuc", soDoDanhMuc);
