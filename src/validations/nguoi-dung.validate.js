// Middleware Validate Người Dùng / Tài Khoản ChipChip
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
  const referer = req.get("Referer") || "/admin/nguoi-dung";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(loiList[0])}`);
};

const idHopLe = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID người dùng không hợp lệ!"]);
  }
  next();
};

const taoMoi = (req, res, next) => {
  const { hoTen, email, password, SDT, vaiTro, trangThai } = req.body;
  const errors = [];

  if (!hoTen || !hoTen.trim()) {
    errors.push("Họ và tên không được để trống!");
  } else if (hoTen.trim().length < 2) {
    errors.push("Họ và tên phải có ít nhất 2 ký tự!");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) {
    errors.push("Địa chỉ email không được để trống!");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Địa chỉ email không đúng định dạng!");
  }

  if (password !== undefined && password !== "" && password.length < 6) {
    errors.push("Mật khẩu phải có độ dài tối thiểu 6 ký tự!");
  }

  if (SDT && !/^[0-9+() -]{9,15}$/.test(SDT.trim())) {
    errors.push("Số điện thoại không đúng định dạng!");
  }

  if (vaiTro && !["khach-hang", "nhan-vien", "admin"].includes(vaiTro)) {
    errors.push("Vai trò tài khoản không hợp lệ!");
  }

  if (trangThai && !["hoat-dong", "khoa"].includes(trangThai)) {
    errors.push("Trạng thái tài khoản không hợp lệ!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const capNhat = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID người dùng không hợp lệ!"]);
  }

  const { hoTen, SDT, vaiTro, trangThai, matKhauMoi } = req.body;
  const errors = [];

  if (hoTen !== undefined && (!hoTen.trim() || hoTen.trim().length < 2)) {
    errors.push("Họ và tên phải có ít nhất 2 ký tự!");
  }

  if (SDT !== undefined && SDT.trim() && !/^[0-9+() -]{9,15}$/.test(SDT.trim())) {
    errors.push("Số điện thoại không đúng định dạng!");
  }

  if (vaiTro !== undefined && !["khach-hang", "nhan-vien", "admin"].includes(vaiTro)) {
    errors.push("Vai trò tài khoản không hợp lệ!");
  }

  if (trangThai !== undefined && !["hoat-dong", "khoa"].includes(trangThai)) {
    errors.push("Trạng thái tài khoản không hợp lệ!");
  }

  if (matKhauMoi && matKhauMoi.trim().length < 6) {
    errors.push("Mật khẩu mới phải có ít nhất 6 ký tự!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const doiTrangThai = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID người dùng không hợp lệ!"]);
  }

  const { trangThai } = req.body;
  const danhSachHopLe = ["hoat-dong", "khoa"];

  if (!trangThai || !danhSachHopLe.includes(trangThai)) {
    return traVeLoiValidate(req, res, [
      `Trạng thái người dùng không hợp lệ! Phải là 'hoat-dong' hoặc 'khoa'`,
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
