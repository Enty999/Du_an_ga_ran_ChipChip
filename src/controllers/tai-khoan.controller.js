const NguoiDung = require("../models/nguoi-dung.model");
const bcrypt = require("bcryptjs");

// [GET] /tai-khoan -> Hiển thị trang thông tin cá nhân
const trangThongTin = (req, res) => {
  res.render("pages/tai-khoan/thong-tin", {
    title: "Thông tin tài khoản",
  });
};

// [GET] /tai-khoan/don-hang -> Hiển thị lịch sử đơn hàng
const trangDonHang = (req, res) => {
  res.render("pages/tai-khoan/don-hang", {
    title: "Đơn hàng của tôi",
  });
};

// [GET] /tai-khoan/doi-mat-khau -> Hiển thị trang đổi mật khẩu
const trangDoiMatKhau = (req, res) => {
  res.render("pages/tai-khoan/doi-mat-khau", {
    title: "Đổi mật khẩu",
  });
};


// [POST] /tai-khoan/doi-mat-khau -> Đổi mật khẩu tài khoản
const doiMatKhau = async (req, res) => {
  try {
    const { matKhauHienTai, matKhauMoi, xacNhanMatKhauMoi } = req.body;
    const userId = res.locals.nguoiDung._id;
    const errors = [];

    // 1. Kiểm tra không để trống
    if (!matKhauHienTai || !matKhauMoi || !xacNhanMatKhauMoi) {
      errors.push("Vui lòng nhập đầy đủ tất cả các trường mật khẩu!");
    }

    // 2. Mật khẩu mới tối thiểu 6 ký tự
    if (matKhauMoi && matKhauMoi.length < 6) {
      errors.push("Mật khẩu mới phải có ít nhất 6 ký tự!");
    }

    // 3. Mật khẩu mới và xác nhận phải trùng nhau
    if (matKhauMoi !== xacNhanMatKhauMoi) {
      errors.push("Xác nhận mật khẩu mới không trùng khớp!");
    }

    // 4. Mật khẩu mới không được trùng mật khẩu cũ
    if (matKhauHienTai && matKhauMoi && matKhauHienTai === matKhauMoi) {
      errors.push("Mật khẩu mới không được trùng với mật khẩu hiện tại!");
    }

    // Nếu có lỗi nhập liệu -> Dừng lại và báo lỗi
    if (errors.length > 0) {
      return res.render("pages/tai-khoan/doi-mat-khau", {
        title: "Đổi mật khẩu",
        errors,
      });
    }

    // 5. Tìm người dùng trong DB (lấy cả trường password đã mã hóa)
    const nguoiDung = await NguoiDung.findById(userId);
    if (!nguoiDung) {
      return res.redirect("/auth/dang-nhap");
    }

    // 6. Kiểm tra xem mật khẩu hiện tại người dùng nhập có đúng không
    const matKhauChinhXac = await bcrypt.compare(matKhauHienTai, nguoiDung.password);
    if (!matKhauChinhXac) {
      return res.render("pages/tai-khoan/doi-mat-khau", {
        title: "Đổi mật khẩu",
        errors: ["Mật khẩu hiện tại không chính xác!"],
      });
    }

    // 7. Cập nhật mật khẩu mới và lưu lại
    // Khi gọi .save(), Mongoose sẽ tự động chạy hàm pre("save") để băm mật khẩu
    nguoiDung.password = matKhauMoi;
    await nguoiDung.save();

    res.render("pages/tai-khoan/doi-mat-khau", {
      title: "Đổi mật khẩu",
      message: "Đổi mật khẩu thành công! Mật khẩu mới đã có hiệu lực.",
    });
  } catch (error) {
    res.status(500).render("pages/tai-khoan/doi-mat-khau", {
      title: "Đổi mật khẩu",
      errors: ["Lỗi server: " + error.message],
    });
  }
};

// [POST] /tai-khoan/cap-nhat -> Xử lý cập nhật thông tin
const xuLiCapNhat = async (req, res) => {
  try {
    const { hoTen, SDT, diaChi, ghiChuGiaoHang } = req.body;
    const userId = res.locals.nguoiDung._id;
    const errors =[];

    if (!hoTen || !hoTen.trim()) {
        errors.push("Họ và tên không được để trống!");
    }
    const dinhDangSDT = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!SDT || !dinhDangSDT.test(SDT.trim())) {
      errors.push("Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số (bắt đầu bằng 03, 05, 07, 08, 09).");
    }

    if(errors.length > 0) {
      return res.render("pages/tai-khoan/thong-tin", {
        title: "Thông tin tài khoản",
        errors,
      });
    }

    const nguoiDungCapNhat = await NguoiDung.findByIdAndUpdate(
      userId,
      {
        hoTen: hoTen.trim(),
        SDT: SDT ? SDT.trim() : "",
        diaChi: diaChi ? diaChi.trim() : "",
        ghiChuGiaoHang: ghiChuGiaoHang ? ghiChuGiaoHang.trim() : "",
      },
      { returnDocument: "after" }
    ).select("-password"); // Không để mật khẩu đã băm lọt vào res.locals/view

    // Người dùng đã bị xóa trong lúc đang đăng nhập -> Bắt đăng nhập lại
    if (!nguoiDungCapNhat) {
      return res.redirect("/auth/dang-nhap");
    }

    res.locals.nguoiDung = nguoiDungCapNhat;

    res.render("pages/tai-khoan/thong-tin", {
      title: "Thông tin tài khoản",
      message: "Cập nhật thông tin nhận hàng thành công!",
    });
  } catch (error) {
    res.status(500).render("pages/tai-khoan/thong-tin", {
      title: "Thông tin tài khoản",
      errors: ["Đã có lỗi xảy ra: " + error.message],
    });
  }
};

module.exports = {
  trangThongTin,
  trangDonHang,
  trangDoiMatKhau,
  xuLiCapNhat,
  doiMatKhau,
};
