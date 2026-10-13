// Middleware kiểm tra quyền Quản trị viên (Admin) và Nhân viên
const yeuCauAdmin = (req, res, next) => {
  const nguoiDung = res.locals.nguoiDung;
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");

  // 1. Chưa đăng nhập
  if (!nguoiDung) {
    if (isApi) {
      return res.status(401).json({
        success: false,
        message: "Phiên đăng nhập đã hết hạn hoặc chưa xác thực quản trị viên!",
        error: "UNAUTHORIZED",
      });
    }
    return res.redirect("/auth/dang-nhap?redirect=" + encodeURIComponent(req.originalUrl));
  }

  // 2. Tài khoản bị khóa
  if (nguoiDung.trangThai === "khoa") {
    res.clearCookie("maXacThuc");
    if (isApi) {
      return res.status(403).json({
        success: false,
        message: "Tài khoản của bạn đã bị khóa bởi hệ thống!",
        error: "ACCOUNT_LOCKED",
      });
    }
    return res.redirect("/auth/dang-nhap?error=" + encodeURIComponent("Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ ban quản trị."));
  }

  // 3. Kiểm tra vai trò: Phải là 'admin' hoặc 'nhan-vien'
  if (nguoiDung.vaiTro !== "admin" && nguoiDung.vaiTro !== "nhan-vien") {
    if (isApi) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác quản trị này!",
        error: "FORBIDDEN",
      });
    }
    return res.status(403).render("pages/auth/khong-co-quyen", {
      title: "Truy cập bị từ chối",
      message: "Bạn không có quyền truy cập vào Khu vực Quản trị Admin của ChipChip!",
    });
  }

  // Đủ điều kiện -> Cho phép tiếp tục
  next();
};

// Middleware chỉ cho phép Quản trị viên tối cao (Super Admin)
const chiAdmin = (req, res, next) => {
  const nguoiDung = res.locals.nguoiDung;
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");

  if (!nguoiDung || nguoiDung.vaiTro !== "admin") {
    if (isApi) {
      return res.status(403).json({
        success: false,
        message: "Chỉ Quản trị viên cấp cao (Admin) mới có quyền thực hiện thao tác này!",
        error: "FORBIDDEN",
      });
    }
    return res.status(403).render("pages/auth/khong-co-quyen", {
      title: "Truy cập bị từ chối",
      message: "Chỉ Quản trị viên cấp cao (Admin) mới có quyền thực hiện thao tác này!",
    });
  }

  next();
};

module.exports = {
  yeuCauAdmin,
  chiAdmin,
};
