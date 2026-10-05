// Controller Auth (Quản lý xác thực người dùng và điều hướng giao diện)

// Import model Người Dùng để thao tác với bảng/collection người dùng trong cơ sở dữ liệu
const NguoiDung = require("../models/nguoi-dung.model");
// Import thư viện jsonwebtoken dùng để tạo và xác thực JWT token
const jwt = require("jsonwebtoken");

// Hàm trợ giúp: Tạo mã xác thực JWT từ ID người dùng với thời hạn sống là 1 ngày (1d)
const taoMaXacThuc = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// [POST] /api/auth/dang-ky
// Xử lý logic đăng ký tài khoản mới qua API
const xuLiDangKy = async (req, res) => {
  try {
    // Lấy thông tin họ tên, email và mật khẩu từ body của request gửi lên
    const { hoten, email, password } = req.body;

    // Kiểm tra xem email này đã tồn tại trong cơ sở dữ liệu hay chưa
    const nguoiDungHienCo = await NguoiDung.findOne({ email });
    if (nguoiDungHienCo) {
      // Nếu đã tồn tại tài khoản với email này, trả về lỗi 400
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Khởi tạo đối tượng người dùng mới từ dữ liệu gửi lên
    const nguoiDungMoi = await NguoiDung.create({ hoten, email, password });

    // Tạo mã token JWT dựa trên _id của người dùng mới tạo
    const maXacThuc = taoMaXacThuc(nguoiDungMoi._id);

    // Trả về mã HTTP 201 (Created) kèm thông tin cơ bản và token
    res.status(201).json({
      message: "Đăng ký thành công",
      maXacThuc,
      user: {
        id: nguoiDungMoi._id,
        hoTen: nguoiDungMoi.hoten,
        email: nguoiDungMoi.email,
      },
    });
  } catch (error) {
    // Bắt lỗi hệ thống/database và trả về mã lỗi 500
    res.status(500).json({ message: error.message });
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
      return res.status(400).json({message: "Email hoặc mật khẩu không đúng"});
    }

    // Gọi phương thức so sánh mật khẩu đã được định nghĩa trong model
    const matKhauDung = await timNguoiDung.kiemTraMatKhau(password);
    if(!matKhauDung){
      // Mật khẩu không trùng khớp thì trả về thông báo lỗi
      return res.status(400).json({message: "Email hoặc mật khẩu không đúng"});
    }

    // Mật khẩu hợp lệ, tạo token xác thực JWT cho phiên đăng nhập
    const maXacThuc = taoMaXacThuc(timNguoiDung._id);

    // Phản hồi thành công mã 200 kèm token và thông tin người dùng
    res.status(200).json({
      message: "Đăng nhập thành công",
      maXacThuc,
      user: {
        id: timNguoiDung._id,
        hoTen: timNguoiDung.hoten,
        email: timNguoiDung.email,
      },
    });
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

