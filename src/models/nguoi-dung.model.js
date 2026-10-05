// Import thư viện Mongoose để tương tác với cơ sở dữ liệu MongoDB
const mongoose = require("mongoose");
// Import thư viện bcryptjs dùng để mã hóa (băm) và kiểm tra mật khẩu bảo mật
const bcrypt = require("bcryptjs");

// Định nghĩa cấu trúc Schema (lược đồ dữ liệu) cho Người Dùng
const soDoNguoiDung = new mongoose.Schema(
  {
    // Họ và tên người dùng
    hoTen: {
      type: String,     // Kiểu dữ liệu là chuỗi
      required: true,   // Bắt buộc phải có
      trim: true,       // Tự động loại bỏ khoảng trắng thừa ở hai đầu chuỗi
    },
    // Địa chỉ email người dùng
    email: {
      type: String,     // Kiểu dữ liệu là chuỗi
      required: true,   // Bắt buộc phải có
      lowercase: true,  // Tự động chuyển toàn bộ ký tự thành chữ thường
      unique: true,     // Đảm bảo không trùng lặp email giữa các tài khoản
    },
    // Mật khẩu của tài khoản (sẽ được mã hóa trước khi lưu)
    password: {
      type: String,     // Kiểu dữ liệu là chuỗi
      required: true,   // Bắt buộc phải có
    },
  },
  { 
    // Tự động thêm hai trường createdAt (thời gian tạo) và updatedAt (thời gian cập nhật gần nhất)
    timestamps: true 
  },
);

// Middleware Mongoose (pre-hook): Chạy tự động trước mỗi lần lưu (save) tài liệu vào cơ sở dữ liệu
soDoNguoiDung.pre("save", async function (next) {
  // Nếu trường mật khẩu không bị thay đổi (ví dụ: chỉ sửa họ tên hoặc email), bỏ qua việc mã hóa lại
  if (!this.isModified("password")) return next();

  // Tạo chuỗi muối (salt) ngẫu nhiên với độ phức tạp là 10 rounds
  const salt = await bcrypt.genSalt(10);
  // Thực hiện băm (mã hóa) mật khẩu với chuỗi muối vừa tạo
  this.password = await bcrypt.hash(this.password, salt);
  // Tiếp tục chuyển sang bước lưu tiếp theo
  next();
});

// Phương thức đối tượng (instance method): Dùng để so sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong database
soDoNguoiDung.methods.kiemTraMatKhau = async function(matKhauNhap){
  // Trả về true nếu mật khẩu nhập khớp với mật khẩu đã băm, ngược lại trả về false
  return await bcrypt.compare(matKhauNhap, this.password);
}

// Khởi tạo và xuất (export) Model "NguoiDung" để có thể sử dụng ở các controller/service khác
module.exports = mongoose.model("NguoiDung", soDoNguoiDung);