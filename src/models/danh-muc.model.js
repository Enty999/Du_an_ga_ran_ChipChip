// Model DanhMuc (Danh mục món ăn / gà rán)
const mongoose = require("mongoose");

// Cấu trúc Schema cho Danh Mục món ăn
const soDoDanhMuc = new mongoose.Schema(
  {
    // Tên danh mục (Ví dụ: Gà sốt đậm vị, Gà truyền thống, Burger & Món phụ, Đồ uống...)
    tenDanhMuc: {
      type: String,
      required: [true, "Vui lòng nhập tên danh mục"],
      trim: true,
      unique: true,
    },
    // Đường dẫn tĩnh thân thiện SEO (Ví dụ: ga-sot-dam-vi)
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Mô tả ngắn gọn về danh mục
    moTa: {
      type: String,
      trim: true,
      default: "",
    },
    // Biểu tượng Material Symbol hoặc FontAwesome (Ví dụ: fastfood, lunch_dining, local_drink)
    bieuTuong: {
      type: String,
      default: "restaurant_menu",
    },
    // Hình ảnh đại diện danh mục
    hinhAnh: {
      type: String,
      default: "",
    },
    // Thứ tự hiển thị ưu tiên trên thanh tab thực đơn
    thuTu: {
      type: Number,
      default: 0,
    },
    // Trạng thái hiển thị trên website: "hien-thi" hoặc "an"
    trangThai: {
      type: String,
      enum: ["hien-thi", "an"],
      default: "hien-thi",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DanhMuc", soDoDanhMuc);
