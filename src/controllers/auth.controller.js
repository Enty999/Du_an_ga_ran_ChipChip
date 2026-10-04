// Controller Auth (Khung sườn gọi View)

// [GET] /auth/dang-nhap
const renderDangNhap = (req, res) => {
  res.render("pages/auth/dang-nhap", { title: "Đăng nhập" });
};

// [GET] /auth/dang-ky
const renderDangKy = (req, res) => {
  res.render("pages/auth/dang-ky", { title: "Đăng ký" });
};

module.exports = {
  renderDangNhap,
  renderDangKy,
};
