// Middleware Validate Danh Mục Món Ăn ChipChip
const mongoose = require("mongoose");

const traVeLoiValidate = (req, res, loiList) => {
  const isApi = req.originalUrl.includes("/api") || req.xhr || req.headers.accept?.includes("application/json");
  if (isApi) {
    return res.status(400).json({
      success: false,
      message: loiList[0],
      errors: loiList,
    });
  }
  const referer = req.get("Referer") || "/admin/danh-muc";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(loiList[0])}`);
};

const idHopLe = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID danh mục không hợp lệ!"]);
  }
  next();
};

const taoMoi = (req, res, next) => {
  const { tenDanhMuc, thuTu } = req.body;
  const errors = [];

  if (!tenDanhMuc || !tenDanhMuc.trim()) {
    errors.push("Tên danh mục không được để trống!");
  } else if (tenDanhMuc.trim().length < 2 || tenDanhMuc.trim().length > 60) {
    errors.push("Tên danh mục phải từ 2 đến 60 ký tự!");
  }

  if (thuTu !== undefined && thuTu !== "" && (isNaN(thuTu) || Number(thuTu) < 0)) {
    errors.push("Thứ tự ưu tiên phải là số nguyên không âm!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const capNhat = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID danh mục không hợp lệ!"]);
  }

  const { tenDanhMuc, thuTu } = req.body;
  const errors = [];

  if (tenDanhMuc !== undefined && (!tenDanhMuc.trim() || tenDanhMuc.trim().length < 2)) {
    errors.push("Tên danh mục phải có ít nhất 2 ký tự!");
  }

  if (thuTu !== undefined && thuTu !== "" && (isNaN(thuTu) || Number(thuTu) < 0)) {
    errors.push("Thứ tự ưu tiên phải là số không âm!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const doiTrangThai = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID danh mục không hợp lệ!"]);
  }

  const { trangThai } = req.body;
  const danhSachHopLe = ["hien-thi", "an"];

  if (!trangThai || !danhSachHopLe.includes(trangThai)) {
    return traVeLoiValidate(req, res, [
      `Trạng thái danh mục không hợp lệ! Phải là 'hien-thi' hoặc 'an'`,
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
