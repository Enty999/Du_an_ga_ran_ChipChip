// Middleware Xử lý lỗi tập trung chuẩn Express.js (Global Error Handling)
const xuLiLoi = (err, req, res, next) => {
  let maLoi = err.status || err.statusCode || 500;
  let thongBao = err.message || "Đã xảy ra lỗi máy chủ nội bộ!";

  // 1. Lỗi CastError của Mongoose (ID không đúng định dạng ObjectId)
  if (err.name === "CastError") {
    maLoi = 400;
    thongBao = `Định dạng dữ liệu không hợp lệ cho trường '${err.path}'!`;
  }

  // 2. Lỗi Mongoose trùng lặp khóa duy nhất (Duplicate Key)
  if (err.code === 11000) {
    maLoi = 400;
    const key = Object.keys(err.keyValue || {})[0] || "dữ liệu";
    thongBao = `Trường '${key}' đã tồn tại trong hệ thống, vui lòng chọn giá trị khác!`;
  }

  // 3. Lỗi ValidationError của Mongoose
  if (err.name === "ValidationError") {
    maLoi = 400;
    const errors = Object.values(err.errors || {}).map((e) => e.message);
    thongBao = errors[0] || "Dữ liệu nhập vào không hợp lệ!";
  }

  // 4. Lỗi JWT
  if (err.name === "JsonWebTokenError") {
    maLoi = 401;
    thongBao = "Mã xác thực không hợp lệ. Vui lòng đăng nhập lại!";
  } else if (err.name === "TokenExpiredError") {
    maLoi = 401;
    thongBao = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại!";
  }

  console.error(`[ERROR ${maLoi}] [${req.method}] ${req.originalUrl}:`, err.message);

  // Phân biệt request RESTful API vs Request duyệt web SSR
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");

  if (isApi) {
    return res.status(maLoi).json({
      success: false,
      message: thongBao,
      error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Nếu là SSR: Render trang lỗi hoặc chuyển hướng với thông báo
  const referer = req.get("Referer") || "/";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(thongBao)}`);
};

module.exports = xuLiLoi;
