const express = require("express");
const path = require("path");

const authRoute = require("./routes/auth.route");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// TODO (BE) - Bước 2: Đọc cookie đăng nhập để header biết ai đang đăng nhập
// 1. Gắn cookie-parser (đã có trong package.json, chưa dùng):
//      const cookieParser = require("cookie-parser");
//      app.use(cookieParser());
// 2. Thêm middleware (gợi ý tạo file src/middlewares/nguoi-dung.middleware.js), đặt TRƯỚC các route:
//    - Đọc req.cookies.maXacThuc -> jwt.verify(...) -> NguoiDung.findById(id).select("hoTen email")
//    - Gán res.locals.nguoiDung = { hoTen, email }   (header.pug đọc đúng tên biến này)
//    - Token sai/hết hạn hoặc không có cookie: gán res.locals.nguoiDung = null rồi next(), KHÔNG chặn request
//      app.use(ganNguoiDungDangNhap);

// Routes
app.use("/auth", authRoute);

// TODO (BE) - Bước 4: Trang tài khoản (header đã có link sẵn, hiện đang 404)
//   GET /tai-khoan            -> Thông tin cá nhân
//   GET /tai-khoan/don-hang   -> Đơn hàng của tôi
//   Hai route này cần middleware bắt buộc đăng nhập, chưa đăng nhập thì redirect("/auth/dang-nhap")
//      app.use("/tai-khoan", taiKhoanRoute);

app.get("/", (req, res) => {
  res.render("pages/trang-chu/trang-chu", { title: "Trang chủ - Gà Rán ChipChip" });
});

// Trang giới thiệu thương hiệu (thiết kế gốc: design/stitch/about)
app.get("/gioi-thieu", (req, res) => {
  res.render("pages/gioi-thieu/gioi-thieu", { title: "Về ChipChip" });
});

module.exports = app;

