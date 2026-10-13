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

// [POST] /auth/dang-nhap
// Xử lý logic đăng nhập tài khoản
const xuLiDangNhap = async (req, res) => {
  try {
    const { email, password } = req.body;
    const input = (email || "").trim().toLowerCase();

    // Tìm kiếm tài khoản linh hoạt: theo email, hoặc nếu nhập "admin" thì tìm tài khoản quản trị
    let timNguoiDung = await NguoiDung.findOne({
      $or: [
        { email: input },
        ...(input === "admin"
          ? [
              { email: "admin@chipchip.vn" },
              { email: "admin@gmail.com" },
              { vaiTro: "admin" },
            ]
          : []),
      ],
    });

    if (!timNguoiDung) {
      return res.render("pages/auth/dang-nhap", {
        title: "Đăng nhập",
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    // Kiểm tra tài khoản có bị khóa không
    if (timNguoiDung.trangThai === "khoa") {
      return res.render("pages/auth/dang-nhap", {
        title: "Đăng nhập",
        error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    // So sánh mật khẩu
    const matKhauDung = await timNguoiDung.kiemTraMatKhau(password);
    if (!matKhauDung) {
      return res.render("pages/auth/dang-nhap", {
        title: "Đăng nhập",
        error: "Email hoặc mật khẩu không đúng",
      });
    }

    // Mật khẩu hợp lệ, tạo token xác thực JWT
    const maXacThuc = taoMaXacThuc(timNguoiDung._id);

    // Lưu token vào cookie
    res.cookie("maXacThuc", maXacThuc, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // Điều hướng: Ưu tiên redirect param -> Nếu là admin/nhân viên thì vào /admin -> Khách thì về trang chủ
    const redirectUrl =
      req.query.redirect ||
      (timNguoiDung.vaiTro === "admin" || timNguoiDung.vaiTro === "nhan-vien"
        ? "/admin"
        : "/?dangNhap=thanhcong");

    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).render("pages/auth/dang-nhap", {
      title: "Đăng nhập",
      error: "Lỗi hệ thống: " + error.message,
    });
  }
};

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

// [POST] /auth/dang-xuat
const xuLiDangXuat = (req, res) => {
    res.clearCookie("maXacThuc");   // Xóa cookie phiên đăng nhập
    res.redirect("/");              // Chuyển hướng về trang chủ
  };

// Xuất các hàm điều hướng giao diện (view controller) để gắn vào route
module.exports = {
  renderDangNhap,
  renderDangKy,
  renderXacNhanOTP,
  xuLiDangNhap,
  xuLiDangKy,
  xuLiXacNhanOTP,
  xuLiDangXuat,
};

