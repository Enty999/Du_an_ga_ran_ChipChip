// Controller Auth (Quản lý xác thực người dùng và điều hướng giao diện)

// Import model Người Dùng để thao tác với bảng/collection người dùng trong cơ sở dữ liệu
const NguoiDung = require("../models/nguoi-dung.model");

// Import thư viện jsonwebtoken dùng để tạo và xác thực JWT token
const jwt = require("jsonwebtoken");

// Import model MaOTP để thao tác với bảng/collection mã OTP trong cơ sở dữ liệu
const MaOTP = require("../models/OTP.model");

// Import service Email để gửi mã OTP
const dichVuEmail = require("../services/email.service");

// Hàm trợ giúp: Tạo mã xác thực JWT từ ID người dùng với thời hạn sống là 1 ngày (1d)
const taoMaXacThuc = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET||"chipchip_secret_key_2026", { expiresIn: "1d" });
};

// Hàm trợ giúp: Tạo mã OTP ngẫu nhiên gồm 6 số ngẫu nhiên
const taoMaOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// [POST] /api/auth/dang-ky
// Xử lý logic đăng ký tài khoản mới qua API
const xuLiDangKy = async (req, res) => {
  try {
    //Lấy thông tin từ form gửi lên
    const { hoTen, email, password,confirmPassword } = req.body;
    const errors = [];
    
    //Ràng buộc họ tên và email ko để trống
    if(!hoTen || !hoTen?.trim()){
      errors.push("Họ tên không được để trống!")
    }
    //Biểu thức bắt buộc kết thúc bằng @gmail.com (chữ hoa/thường đều được)
    const dinhDangEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if(!email|| !dinhDangEmail.test(email)){
      errors.push("Email không hợp lệ bắt buộc phải có đuôi @gmail.com!")
    }

    //Ràng buộc độ dài mật khẩu (tối thiệu 6 ký tự)
    if(!password || password.length < 6){
      errors.push("Mật khẩu phải chứa ít nhất 6 ký tự!")
    }

    //Kiểm tra mật khẩu có khớp ko
    if(password !== confirmPassword){
      errors.push("Mật khẩu xác nhận không khớp!")
    }

    //Nếu có lỗi thì render lại trang đăng ký
    if(errors.length > 0){
      return res.render("pages/auth/dang-ky",{
        title: "Đăng ký",
        errors: errors,
        values: req.body   // Lưu lại dữ liệu nhập vào form để khi load lại form không bị mất
      });
    }

    // Kiểm tra xem email này đã tồn tại trong cơ sở dữ liệu hay chưa
    const nguoiDungHienCo = await NguoiDung.findOne({ email });
    if (nguoiDungHienCo) {
      // Nếu đã tồn tại tài khoản với email này trả lỗi
      return res.render("pages/auth/dang-ky",{
        title: "Đăng ký",
        errors: ["Email đã tồn tại"],
        values: req.body   // Lưu lại dữ liệu nhập vào form để khi load lại form không bị mất
      });
    }

    // Mã OTP mới
    const maOTPMoi = taoMaOTP();

    // Xóa OTP cũ nếu đã gửi trước đó
    await MaOTP.deleteMany({ email });

    // Lưu thông tin người dùng tạm thời cùng mã OTP vào cơ sở dữ liệu
    await MaOTP.create({
        email: email.trim().toLowerCase(),
        maOTP: maOTPMoi,
        hoTen: hoTen.trim(),
        password
    })

    // Gửi email chữa mã OTP đến người dùng
    await dichVuEmail.guiEmailXacThucOTP(email, maOTPMoi);

    // Chuyển sang trang nhập mã OTP
    res.redirect(`/auth/xac-nhan-otp?email=${encodeURIComponent(email)}`);

   
  } catch (error) {
    // Nếu có lỗi hệ thống phát sinh, hiển thị ra giao diện 
    res.render("pages/auth/dang-ky", {
      title: "Đăng ký",
      errors: [error.message]
    });
  }
};

// [POST] /api/auth/dang-nhap
// Xử lý logic đăng nhập tài khoản qua API
const xuLiDangNhap = async (req, res) =>{
  try {
    // Lấy email và password từ request body
    const {email, password} = req.body;

    // Tìm kiếm tài khoản người dùng theo email trong database
    const timNguoiDung = await NguoiDung.findOne({email});
    if(!timNguoiDung){
      // Không tìm thấy tài khoản thì trả về thông báo lỗi
      return res.render("pages/auth/dang-nhap", {
        title: "Đăng nhập",
        error: "Email hoặc mật khẩu không đúng"
      });
    }

    // Gọi phương thức so sánh mật khẩu đã được định nghĩa trong model
    const matKhauDung = await timNguoiDung.kiemTraMatKhau(password);
    if(!matKhauDung){
      // Mật khẩu không trùng khớp thì trả về thông báo lỗi
      return res.render("pages/auth/dang-nhap", {
        title: "Đăng nhập",
        error: "Email hoặc mật khẩu không đúng"
      });
    }

    // Mật khẩu hợp lệ, tạo token xác thực JWT cho phiên đăng nhập
    const maXacThuc = taoMaXacThuc(timNguoiDung._id);

    // Phản hồi thành công mã 200 kèm token và thông tin người dùng
    res.redirect("/");
  } catch (error) {
    // Bắt lỗi hệ thống/server và trả về mã lỗi 500
    res.status(500).json({ message: error.message });
  }
}

// Xử lý logic xác nhận OTP qua API
const xuLiXacNhanOTP = async (req, res) => {
  try {
    // Lấy email và mã OTP từ request body
    const { email, maOTP } = req.body;
    // Tìm mã OTP trong database
    const maOTPStored = await MaOTP.findOne({ email, maOTP });
    // Nếu không tìm thấy mã OTP
    if (!maOTPStored) {
      return res.render("pages/auth/xac-nhan-otp", {
        title: "Xác nhận OTP",
        error: "Mã OTP không tồn tại hoặc đã hết hạn",
        email: email,
      });
    }
    // Mã OTP chính xác -> Tạo tài khoản chính thức vào bảng Người Dùng
    await NguoiDung.create({
      hoTen: maOTPStored.hoTen,
      email: maOTPStored.email,
      password: maOTPStored.password,
    });
    // Xóa bản ghi OTP sau khi sử dụng thành công
    await MaOTP.deleteMany({ email });
    // Chuyển hướng sang trang đăng nhập thành công
    res.redirect("/auth/dang-nhap");
  } catch (error) {
    res.render("pages/auth/xac-nhan-otp", {
      title: "Xác thực mã OTP",
      email: req.body.email,
      error: error.message,
    });
  }
};

// [GET] /auth/xac-nhan-otp
const renderXacNhanOTP = (req, res) => {
  const { email } = req.query;
  if(!email){
    return res.redirect("/auth/dang-ky");
  }
  res.render("pages/auth/xac-nhan-otp", {
    title: "Xác nhận OTP",
    email: email
  });
};

// [GET] /auth/dang-nhap
const renderDangNhap = (req, res) => {
  res.render("pages/auth/dang-nhap", { title: "Đăng nhập" });
};

// [GET] /auth/dang-ky
const renderDangKy = (req, res) => {
  res.render("pages/auth/dang-ky", { title: "Đăng ký" });
};

// Xuất các hàm điều hướng giao diện (view controller) để gắn vào route
module.exports = {
  renderDangNhap,
  renderDangKy,
  renderXacNhanOTP,
  xuLiDangNhap,
  xuLiDangKy,
  xuLiXacNhanOTP,
};

