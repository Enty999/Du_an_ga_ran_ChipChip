// Controller Auth (Quản lý xác thực người dùng và điều hướng giao diện)

// Import model Người Dùng để thao tác với bảng/collection người dùng trong cơ sở dữ liệu
const NguoiDung = require("../models/nguoi-dung.model");

// Import thư viện jsonwebtoken dùng để tạo và xác thực JWT token
const jwt = require("jsonwebtoken");

// Import model MaOTP để thao tác với bảng/collection mã OTP trong cơ sở dữ liệu
const MaOTP = require("../models/OTP.model");

// Import service Email để gửi mã OTP
const dichVuEmail = require("../services/email.service");

const bcrypt = require("bcryptjs");

// Hàm trợ giúp: Tạo mã xác thực JWT từ ID người dùng với thời hạn sống là 1 ngày (1d)
const taoMaXacThuc = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
    const { hoTen, email, password, confirmPassword } = req.body;

    // Kiểm tra xem email này đã tồn tại trong cơ sở dữ liệu hay chưa
    const nguoiDungHienCo = await NguoiDung.findOne({ email });
    if (nguoiDungHienCo) {
      // Nếu đã tồn tại tài khoản với email này trả lỗi
      return res.render("pages/auth/dang-ky", {
        title: "Đăng ký",
        errors: ["Email đã tồn tại"],
        values: req.body, // Lưu lại dữ liệu nhập vào form để khi load lại form không bị mất
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
      password,
    });

    // Gửi email chữa mã OTP đến người dùng
    await dichVuEmail.guiEmailXacThucOTP(email, maOTPMoi);

    // Chuyển sang trang nhập mã OTP
    res.redirect(`/auth/xac-nhan-otp?email=${encodeURIComponent(email)}`);
  } catch (error) {
    // Nếu có lỗi hệ thống phát sinh, hiển thị ra giao diện
    res.render("pages/auth/dang-ky", {
      title: "Đăng ký",
      errors: [error.message],
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
    await NguoiDung.collection.insertOne({
      hoTen: maOTPStored.hoTen,
      email: maOTPStored.email,
      password: maOTPStored.password,
      SDT: "",
      diaChi: "",
      ghiChuGiaoHang: "",
      vaiTro: "khach-hang",
      trangThai: "hoat-dong",
      createdAt: new Date(),
      updatedAt: new Date(),
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
  if (!email) {
    return res.redirect("/auth/dang-ky");
  }
  res.render("pages/auth/xac-nhan-otp", {
    title: "Xác nhận OTP",
    email: email,
  });
};

// [GET] /auth/dang-nhap
const renderDangNhap = (req, res) => {
  const success = req.query.doiMatKhau === "thanhcong" 
    ? "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới." 
    : null;
  res.render("pages/auth/dang-nhap", { title: "Đăng nhập", success });
};

// [GET] /auth/dang-ky
const renderDangKy = (req, res) => {
  res.render("pages/auth/dang-ky", { title: "Đăng ký" });
};

// [POST] /auth/dang-xuat
const xuLiDangXuat = (req, res) => {
  res.clearCookie("maXacThuc"); // Xóa cookie phiên đăng nhập
  res.redirect("/"); // Chuyển hướng về trang chủ
};

// [GET] /auth/quen-mat-khau: Hiển thị form nhập email
const renderQuenMatKhau = (req, res) => {
  res.render("pages/auth/quen-mat-khau", { title: "Quên mật khẩu" });
};

// [POST] /auth/quen-mat-khau: Xử lý gửi mã OTP (BĂM OTP TRƯỚC KHI LƯU VÀO USER)
const xuLiQuenMatKhau = async (req, res) => {
  try {
    const { email } = req.body;
    const emailClean = (email || "").trim().toLowerCase();

    // 1. Kiểm tra tài khoản có tồn tại không
    const nguoiDung = await NguoiDung.findOne({ email: emailClean });
    if (!nguoiDung) {
      return res.render("pages/auth/quen-mat-khau", {
        title: "Quên mật khẩu",
        error: "Email này chưa được đăng ký tài khoản tại ChipChip!",
        email: emailClean,
      });
    }

    if (nguoiDung.trangThai === "khoa") {
      return res.render("pages/auth/quen-mat-khau", {
        title: "Quên mật khẩu",
        error: "Tài khoản của bạn đang bị khóa. Vui lòng liên hệ quản trị viên!",
      });
    }

    // 2. Sinh mã OTP 6 số ngẫu nhiên
    const maOTP = taoMaOTP();

    // 3. BĂM MÃ OTP BẰNG BCRYPT (Chuẩn bảo mật Thầy dạy)
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(maOTP, salt);

    // 4. Lưu mã OTP đã băm + thời gian hết hạn (5 phút) vào tài khoản User
    nguoiDung.resetPasswordOTP = hashedOTP;
    nguoiDung.resetPasswordExpires = new Date(Date.now() + 5 * 60 * 1000);
    await nguoiDung.save();

    // 5. Gửi email chứa mã OTP gốc cho người dùng
    await dichVuEmail.guiEmailQuenMatKhau(emailClean, maOTP);

    // 6. Chuyển hướng sang trang nhập OTP và mật khẩu mới
    res.redirect(`/auth/dat-lai-mat-khau?email=${encodeURIComponent(emailClean)}`);
  } catch (error) {
    console.error("[LỖI QUÊN MẬT KHẨU]:", error);
    res.render("pages/auth/quen-mat-khau", {
      title: "Quên mật khẩu",
      error: "Đã có lỗi xảy ra: " + error.message,
    });
  }
};

// [GET] /auth/dat-lai-mat-khau: Hiển thị form đặt mật khẩu mới
const renderDatLaiMatKhau = (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.redirect("/auth/quen-mat-khau");
  }
  res.render("pages/auth/dat-lai-mat-khau", {
    title: "Đặt lại mật khẩu",
    email,
  });
};

// [POST] /auth/dat-lai-mat-khau: Kiểm tra OTP băm và lưu mật khẩu mới
const xuLiDatLaiMatKhau = async (req, res) => {
  try {
    const { email, maOTP, password, confirmPassword } = req.body;
    const emailClean = (email || "").trim().toLowerCase();

    // 1. Kiểm tra mật khẩu hợp lệ
    if (!password || password.length < 6) {
      return res.render("pages/auth/dat-lai-mat-khau", {
        title: "Đặt lại mật khẩu",
        email: emailClean,
        error: "Mật khẩu mới phải có tối thiểu 6 ký tự!",
      });
    }

    if (password !== confirmPassword) {
      return res.render("pages/auth/dat-lai-mat-khau", {
        title: "Đặt lại mật khẩu",
        email: emailClean,
        error: "Xác nhận mật khẩu mới không khớp!",
      });
    }

    // 2. Tìm người dùng có OTP còn hiệu lực (chưa quá 5 phút)
    const nguoiDung = await NguoiDung.findOne({
      email: emailClean,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!nguoiDung || !nguoiDung.resetPasswordOTP) {
      return res.render("pages/auth/dat-lai-mat-khau", {
        title: "Đặt lại mật khẩu",
        email: emailClean,
        error: "Mã OTP đã hết hạn (quá 5 phút) hoặc không tồn tại. Vui lòng gửi lại yêu cầu!",
      });
    }

    // 3. DÙNG BCRYPT SO SÁNH MÃ OTP KHÁCH NHẬP VỚI MÃ ĐÃ BĂM TRONG DB
    const isMatch = await bcrypt.compare((maOTP || "").trim(), nguoiDung.resetPasswordOTP);
    if (!isMatch) {
      return res.render("pages/auth/dat-lai-mat-khau", {
        title: "Đặt lại mật khẩu",
        email: emailClean,
        error: "Mã OTP không chính xác. Vui lòng kiểm tra lại email!",
      });
    }

    // 4. Mã OTP đúng -> Cập nhật mật khẩu mới (Mongoose pre-save sẽ tự động băm mật khẩu mới này)
    nguoiDung.password = password;
    nguoiDung.resetPasswordOTP = null;
    nguoiDung.resetPasswordExpires = null;
    await nguoiDung.save();

    // 5. Chuyển về trang đăng nhập kèm cờ thông báo thành công
    res.redirect("/auth/dang-nhap?doiMatKhau=thanhcong");
  } catch (error) {
    console.error("[LỖI ĐẶT LẠI MẬT KHẨU]:", error);
    res.render("pages/auth/dat-lai-mat-khau", {
      title: "Đặt lại mật khẩu",
      email: req.body.email,
      error: "Đã có lỗi xảy ra: " + error.message,
    });
  }
};
// Xuất các hàm điều hướng giao diện (view controller) để gắn vào route
module.exports = {
  renderDangNhap,
  renderDangKy,
  renderXacNhanOTP,
  renderQuenMatKhau,
  renderDatLaiMatKhau,
  xuLiDangNhap,
  xuLiDangKy,
  xuLiXacNhanOTP,
  xuLiQuenMatKhau,
  xuLiDatLaiMatKhau,
  xuLiDangXuat,
};
