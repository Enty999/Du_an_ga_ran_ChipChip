// Middleware Validate Sản Phẩm / Món ăn ChipChip
const mongoose = require("mongoose");

// Helper phản hồi lỗi linh hoạt cho cả RESTful API và Form SSR
const traVeLoiValidate = (req, res, loiList) => {
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");
  if (isApi) {
    return res.status(400).json({
      success: false,
      message: loiList[0],
      errors: loiList,
    });
  }
  const referer = req.get("Referer") || "/admin/san-pham";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(loiList[0])}`);
};

const idHopLe = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID món ăn không hợp lệ!"]);
  }
  next();
};

const taoMoi = (req, res, next) => {
  const { tenSanPham, maDanhMuc, giaGoc, giaKhuyenMai, soLuongTon } = req.body;
  const errors = [];

  if (!tenSanPham || !tenSanPham.trim()) {
    errors.push("Tên món ăn không được để trống!");
  } else if (tenSanPham.trim().length < 2 || tenSanPham.trim().length > 100) {
    errors.push("Tên món ăn phải từ 2 đến 100 ký tự!");
  }

  if (!maDanhMuc || !mongoose.Types.ObjectId.isValid(maDanhMuc)) {
    errors.push("Vui lòng chọn danh mục hợp lệ cho món ăn!");
  }

  if (giaGoc === undefined || giaGoc === null || giaGoc === "") {
    errors.push("Giá gốc món ăn không được để trống!");
  } else if (isNaN(giaGoc) || Number(giaGoc) < 0) {
    errors.push("Giá gốc phải là số dương lớn hơn hoặc bằng 0!");
  }

  if (giaKhuyenMai !== undefined && giaKhuyenMai !== null && giaKhuyenMai !== "") {
    if (isNaN(giaKhuyenMai) || Number(giaKhuyenMai) < 0) {
      errors.push("Giá khuyến mãi phải là số dương lớn hơn hoặc bằng 0!");
    } else if (Number(giaGoc) > 0 && Number(giaKhuyenMai) > Number(giaGoc)) {
      errors.push("Giá khuyến mãi không được lớn hơn giá gốc!");
    }
  }

  if (soLuongTon !== undefined && soLuongTon !== null && soLuongTon !== "") {
    if (isNaN(soLuongTon) || Number(soLuongTon) < 0) {
      errors.push("Số lượng tồn kho phải là số nguyên không âm!");
    }
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const capNhat = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID món ăn không hợp lệ!"]);
  }

  const { tenSanPham, maDanhMuc, giaGoc, giaKhuyenMai, soLuongTon } = req.body;
  const errors = [];

  if (tenSanPham !== undefined && (!tenSanPham.trim() || tenSanPham.trim().length < 2)) {
    errors.push("Tên món ăn phải có ít nhất 2 ký tự!");
  }

  if (maDanhMuc !== undefined && !mongoose.Types.ObjectId.isValid(maDanhMuc)) {
    errors.push("Danh mục món ăn không hợp lệ!");
  }

  if (giaGoc !== undefined && (isNaN(giaGoc) || Number(giaGoc) < 0)) {
    errors.push("Giá gốc phải là số lớn hơn hoặc bằng 0!");
  }

  if (giaKhuyenMai !== undefined && giaKhuyenMai !== "" && (isNaN(giaKhuyenMai) || Number(giaKhuyenMai) < 0)) {
    errors.push("Giá khuyến mãi phải là số lớn hơn hoặc bằng 0!");
  }

  if (soLuongTon !== undefined && (isNaN(soLuongTon) || Number(soLuongTon) < 0)) {
    errors.push("Số lượng tồn kho phải là số nguyên không âm!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const doiTrangThai = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID món ăn không hợp lệ!"]);
  }

  const { trangThai } = req.body;
  const danhSachHopLe = ["dang-ban", "het-hang", "ngung-ban"];

  if (!trangThai || !danhSachHopLe.includes(trangThai)) {
    return traVeLoiValidate(req, res, [
      `Trạng thái món ăn không hợp lệ! Phải là một trong: ${danhSachHopLe.join(", ")}`,
    ]);
  }

  next();
};

module.exports = {
  idHopLe,
  taoMoi,
  capNhat,
  doiTrangThai,
};
