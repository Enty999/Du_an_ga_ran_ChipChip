// Middleware Xử lý lỗi 404 Not Found chuẩn Express.js
const khongTimThay = (req, res, next) => {
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");

  if (isApi) {
    return res.status(404).json({
      success: false,
      message: `Tài nguyên hoặc endpoint API '${req.method} ${req.originalUrl}' không tồn tại!`,
      error: "ROUTE_NOT_FOUND",
    });
  }

  res.status(404).render("pages/auth/khong-co-quyen", {
    title: "404 - Không tìm thấy trang",
    message: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển!",
  });
};

module.exports = khongTimThay;
