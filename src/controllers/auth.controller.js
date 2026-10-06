// Controller Auth (Quản lý xác thực người dùng và điều hướng giao diện)

// Import model Người Dùng để thao tác với bảng/collection người dùng trong cơ sở dữ liệu
const NguoiDung = require("../models/nguoi-dung.model");
// Import thư viện jsonwebtoken dùng để tạo và xác thực JWT token
const jwt = require("jsonwebtoken");

// Hàm trợ giúp: Tạo mã xác thực JWT từ ID người dùng với thời hạn sống là 1 ngày (1d)
const taoMaXacThuc = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET||"chipchip_secret_key_2026", { expiresIn: "1d" });
};

// [POST] /api/auth/dang-ky
// Xử lý logic đăng ký tài khoản mới qua API
const xuLiDangKy = async (req, res) => {
  try {
    //Lấy thông tin từ form gửi lên
    const { hoTen, email, password,confirmPassword } = req.body;
    const errors = [];
    
    //Ràng buộc họ tên và email ko để trống
    if(!hoTen || !hoTen.trim()){
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

    // Khởi tạo đối tượng người dùng mới từ dữ liệu gửi lên
    const nguoiDungMoi = await 
      NguoiDung.create({ 
        hoTen: hoTen.trim() , 
        email: email.trim().toLowerCase() , 
        password 
    });

    // Tạo mã token JWT dựa trên _id của người dùng mới tạo
    const maXacThuc = taoMaXacThuc(nguoiDungMoi._id);

    // chuyển sang trang đăng nhập thành công
    res.redirect("/auth/dang-nhap");
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
  xuLiDangNhap,
  xuLiDangKy,
};

