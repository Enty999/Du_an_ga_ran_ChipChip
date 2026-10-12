const jwt = require("jsonwebtoken");
const NguoiDung = require("../models/nguoi-dung.model");

// Middleware 1: Lấy thông tin người dùng từ cookie gắn vào giao diện (chạy ở mọi trang)
const ganThongTinNguoiDung = async (req, res, next) => {
  const token = req.cookies ? req.cookies.maXacThuc : null;

  // Nếu không có token -> chưa đăng nhập, gán null cho view và cho đi tiếp
  if (!token) {
    res.locals.nguoiDung = null;
    return next();
  }

  try {
    // Giải mã token lấy ID người dùng
    const giaiMa = jwt.verify(token, process.env.JWT_SECRET || "chipchip_secret_key_2026");
    
    // Tìm người dùng trong DB (lấy tất cả trừ mật khẩu)
    const nguoiDung = await NguoiDung.findById(giaiMa.id).select("-password");

    // Gán vào res.locals để header.pug có thể đọc được
    res.locals.nguoiDung = nguoiDung || null;
    next();
  } catch (error) {
    // Token không hợp lệ hoặc hết hạn -> Xóa cookie và coi như chưa đăng nhập
    res.clearCookie("maXacThuc");
    res.locals.nguoiDung = null;
    next();
  }
};

// Middleware 2: Bắt buộc phải đăng nhập (dùng để bảo vệ trang cá nhân, giỏ hàng...)
const yeuCauDangNhap = (req, res, next) => {
  // Nếu chưa có thông tin người dùng đăng nhập -> Chuyển hướng sang trang đăng nhập
  if (!res.locals.nguoiDung) {
    return res.redirect("/auth/dang-nhap");
  }
  next();
};

module.exports = {
  ganThongTinNguoiDung,
  yeuCauDangNhap,
};
