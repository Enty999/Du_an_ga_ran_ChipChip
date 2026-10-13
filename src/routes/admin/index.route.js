// Route tổng hợp cho phân hệ Quản trị Admin ChipChip
const express = require("express");
const router = express.Router();

const { yeuCauAdmin } = require("../../middlewares/kiem-tra-admin.middleware");

// Import các route con
const tongQuanRoute = require("./tong-quan.route");
const sanPhamRoute = require("./san-pham.route");
const danhMucRoute = require("./danh-muc.route");
const donHangRoute = require("./don-hang.route");
const nguoiDungRoute = require("./nguoi-dung.route");
const khuyenMaiRoute = require("./khuyen-mai.route");
const apiRoute = require("./api.route");

// Bảo vệ toàn bộ phân hệ Admin bằng middleware yeuCauAdmin
router.use(yeuCauAdmin);

// Gắn RESTful API endpoint chuẩn (/admin/api)
router.use("/api", apiRoute);

// Gắn các phân hệ giao diện SSR
router.use("/", tongQuanRoute);
router.use("/san-pham", sanPhamRoute);
router.use("/danh-muc", danhMucRoute);
router.use("/don-hang", donHangRoute);
router.use("/nguoi-dung", nguoiDungRoute);
router.use("/khuyen-mai", khuyenMaiRoute);

module.exports = router;
