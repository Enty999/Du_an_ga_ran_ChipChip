const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const xacThucRoute = require("./routes/xac-thuc.route");
const { ganThongTinNguoiDung } = require("./middlewares/kiem-tra-dang-nhap.middleware");
const taiKhoanRoute = require("./routes/tai-khoan.route");
const sanPhamRoute = require("./routes/san-pham.route");

const adminRoute = require("./routes/admin/index.route");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.use(cookieParser());
app.use(ganThongTinNguoiDung);

app.use("/thuc-don", sanPhamRoute);

// Routes
app.use("/auth", xacThucRoute);
app.use("/tai-khoan", taiKhoanRoute);
app.use("/san-pham", sanPhamRoute);

// Phân hệ Quản trị Admin ChipChip
app.use("/admin", adminRoute);

// Phân hệ RESTful API chuẩn quốc tế (/api/v1/admin và /api/admin)
const adminApiRoute = require("./routes/admin/api.route");
const { yeuCauAdmin } = require("./middlewares/kiem-tra-admin.middleware");
app.use("/api/v1/admin", yeuCauAdmin, adminApiRoute);
app.use("/api/admin", yeuCauAdmin, adminApiRoute);

const trangChuController = require("./controllers/trang-chu.controller");

app.get("/", trangChuController.renderTrangChu);

// Trang giới thiệu thương hiệu (thiết kế gốc: design/stitch/about)
app.get("/gioi-thieu", (req, res) => {
  res.render("pages/gioi-thieu/gioi-thieu", { title: "Về ChipChip" });
});

// Middleware xử lý 404 Not Found
const khongTimThay = require("./middlewares/khong-tim-thay.middleware");
app.use(khongTimThay);

// Middleware xử lý lỗi tập trung toàn ứng dụng (Global Error Handler)
const xuLiLoi = require("./middlewares/xu-li-loi.middleware");
app.use(xuLiLoi);

module.exports = app;

