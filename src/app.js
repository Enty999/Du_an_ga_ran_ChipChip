const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const xacThucRoute = require("./routes/xac-thuc.route");
const { ganThongTinNguoiDung } = require("./middlewares/kiem-tra-dang-nhap.middleware");
const taiKhoanRoute = require("./routes/tai-khoan.route");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use(cookieParser());
app.use(ganThongTinNguoiDung);

// Routes
app.use("/auth", xacThucRoute);

// Dùng route tài khoản (đã có middleware bảo vệ bên trong)
app.use("/tai-khoan", taiKhoanRoute);

app.get("/", (req, res) => {
  res.render("pages/trang-chu/trang-chu", { title: "Trang chủ - Gà Rán ChipChip" });
});

// Trang giới thiệu thương hiệu (thiết kế gốc: design/stitch/about)
app.get("/gioi-thieu", (req, res) => {
  res.render("pages/gioi-thieu/gioi-thieu", { title: "Về ChipChip" });
});

module.exports = app;

