// Model SanPham (Món ăn / Gà rán ChipChip)
const mongoose = require("mongoose");
const { taoSlug } = require("../utils/dinh-dang.util");

// Cấu trúc Schema cho Món ăn / Sản phẩm
const soDoSanPham = new mongoose.Schema(
  {
    // Tên món ăn (Ví dụ: Gà Cay Sốt Cay Ngọt Seoul)
    tenSanPham: {
      type: String,
      required: [true, "Vui lòng nhập tên món ăn"],
      trim: true,
    },
    // Đường dẫn tĩnh (slug) duy nhất
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Danh mục món ăn
    maDanhMuc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DanhMuc",
      required: [true, "Vui lòng chọn danh mục cho món ăn"],
    },
    // Giá gốc (VNĐ)
    giaGoc: {
      type: Number,
      required: [true, "Vui lòng nhập giá gốc"],
      min: [0, "Giá không được nhỏ hơn 0"],
    },
    // Giá khuyến mãi (nếu có)
    giaKhuyenMai: {
      type: Number,
      default: 0,
      min: [0, "Giá khuyến mãi không hợp lệ"],
    },
    // Khẩu phần hiển thị (Ví dụ: "2 miếng", "1 Đùi lớn", "4 Cánh", "Tiết kiệm 25k")
    khauPhan: {
      type: String,
      default: "1 phần",
      trim: true,
    },
    // Tên tiếng Anh phụ (Ví dụ: Seoul Yangnyeom Crisp, Snowy Cheddar Wings)
    tenTiengAnh: {
      type: String,
      default: "",
      trim: true,
    },
    // Mô tả chi tiết nguyên liệu, hương vị món
    moTa: {
      type: String,
      default: "",
      trim: true,
    },
    // Đường dẫn ảnh sản phẩm
    hinhAnh: {
      type: String,
      default: "/images/trang-chu/thuc-don-01.jpg",
      trim: true,
    },
    // Huy hiệu gắn trên ảnh (Ví dụ: "Bán chạy nhất", "Siêu giòn", "Trẻ em yêu thích", "Combo Tiết Kiệm")
    huyHieu: {
      type: String,
      default: "",
      trim: true,
    },
    // Kiểu màu huy hiệu: "secondary", "amber", "primary-container", "crimson", "primary"
    loaiHuyHieu: {
      type: String,
      default: "secondary",
    },
    // Món nổi bật (hiển thị trên trang chủ)
    noiBat: {
      type: Boolean,
      default: false,
    },
    // Món bán chạy nhất
    banChay: {
      type: Boolean,
      default: false,
    },
    // Số lượng tồn trong bếp
    soLuongTon: {
      type: Number,
      default: 100,
      min: [0, "Số lượng tồn không âm"],
    },
    // Số phần đã bán ra
    daBan: {
      type: Number,
      default: 0,
    },
    // Trạng thái mở bán: "dang-ban", "het-hang", "ngung-ban"
    trangThai: {
      type: String,
      enum: ["dang-ban", "het-hang", "ngung-ban"],
      default: "dang-ban",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field: giá bán thực tế sau khi tính khuyến mãi
soDoSanPham.virtual("giaHienTai").get(function () {
  if (this.giaKhuyenMai && this.giaKhuyenMai > 0 && this.giaKhuyenMai < this.giaGoc) {
    return this.giaKhuyenMai;
  }
  return this.giaGoc;
});

// Tự động sinh slug chuẩn SEO trước khi validate dữ liệu
soDoSanPham.pre("validate", function () {
  if (this.tenSanPham && (!this.slug || this.isModified("tenSanPham"))) {
    this.slug = taoSlug(this.tenSanPham);
  }
});

// Kích hoạt virtual fields khi chuyển đổi sang JSON/Object
soDoSanPham.set("toJSON", { virtuals: true });
soDoSanPham.set("toObject", { virtuals: true });

// Tham số thứ 3 là "sanphams" đảm bảo Mongoose trỏ CHÍNH XÁC vào collection có sẵn trên Atlas
module.exports = mongoose.model("SanPham", soDoSanPham, "sanphams");
