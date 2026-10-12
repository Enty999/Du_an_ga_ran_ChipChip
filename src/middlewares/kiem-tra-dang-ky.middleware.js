const kiemTraDangKy = (req, res, next) => {
  // Lấy dữ liệu người dùng nhập gửi lên
  const { hoTen, email, password, confirmPassword } = req.body;
  const errors = [];

  // 1. Ràng buộc họ tên không để trống
  if (!hoTen || !hoTen?.trim()) {
    errors.push("Họ tên không được để trống!");
  }

  // 2. Biểu thức bắt buộc kết thúc bằng @gmail.com
  const dinhDangEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!email || !dinhDangEmail.test(email)) {
    errors.push("Email không hợp lệ bắt buộc phải có đuôi @gmail.com!");
  }

  // 3. Ràng buộc độ dài mật khẩu (tối thiểu 6 ký tự)
  if (!password || password.length < 6) {
    errors.push("Mật khẩu phải chứa ít nhất 6 ký tự!");
  }

  // 4. Kiểm tra mật khẩu xác nhận có khớp không
  if (password !== confirmPassword) {
    errors.push("Mật khẩu xác nhận không khớp!");
  }

  // 5. Nếu có bất kỳ lỗi nào -> Render lại trang Đăng ký kèm danh sách lỗi
  if (errors.length > 0) {
    return res.render("pages/auth/dang-ky", {
      title: "Đăng ký",
      errors: errors,
      values: req.body // Giữ lại dữ liệu đã nhập
    });
  }

  // 6. Dữ liệu hoàn toàn hợp lệ -> Cho phép đi tiếp vào Controller!
  next();
};

module.exports = {
  kiemTraDangKy,
};
