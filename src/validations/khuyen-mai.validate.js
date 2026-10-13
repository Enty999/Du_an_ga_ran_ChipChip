// Middleware Validate Mã Khuyến Mãi / Voucher ChipChip
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
  const referer = req.get("Referer") || "/admin/khuyen-mai";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(loiList[0])}`);
};

const idHopLe = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID khuyến mãi không hợp lệ!"]);
  }
  next();
};

const taoMoi = (req, res, next) => {
  const { maCode, tieuDe, loaiGiamGia, giaTriGiam, giamToiDa, donHangToiThieu, soLuong } = req.body;
  const errors = [];

  if (!maCode || !maCode.trim()) {
    errors.push("Mã voucher code không được để trống!");
  } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(maCode.trim())) {
    errors.push("Mã voucher chỉ gồm chữ, số, gạch ngang, dài từ 3-20 ký tự!");
  }

  if (!tieuDe || !tieuDe.trim()) {
    errors.push("Tiêu đề chương trình khuyến mãi không được để trống!");
  }

  if (giaTriGiam === undefined || giaTriGiam === "" || isNaN(giaTriGiam) || Number(giaTriGiam) <= 0) {
    errors.push("Giá trị giảm phải là số lớn hơn 0!");
  } else if (loaiGiamGia === "phan-tram" && Number(giaTriGiam) > 100) {
    errors.push("Giảm giá theo phần trăm không được vượt quá 100%!");
  }

  if (giamToiDa !== undefined && giamToiDa !== "" && (isNaN(giamToiDa) || Number(giamToiDa) < 0)) {
    errors.push("Giảm tối đa phải là số không âm!");
  }

  if (donHangToiThieu !== undefined && donHangToiThieu !== "" && (isNaN(donHangToiThieu) || Number(donHangToiThieu) < 0)) {
    errors.push("Đơn hàng tối thiểu phải là số không âm!");
  }

  if (soLuong !== undefined && soLuong !== "" && (isNaN(soLuong) || Number(soLuong) <= 0)) {
    errors.push("Số lượng voucher phát hành phải lớn hơn 0!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const capNhat = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID khuyến mãi không hợp lệ!"]);
  }

  const { tieuDe, loaiGiamGia, giaTriGiam, giamToiDa, donHangToiThieu, soLuong } = req.body;
  const errors = [];

  if (tieuDe !== undefined && !tieuDe.trim()) {
    errors.push("Tiêu đề khuyến mãi không được để trống!");
  }

  if (giaTriGiam !== undefined && (isNaN(giaTriGiam) || Number(giaTriGiam) <= 0)) {
    errors.push("Giá trị giảm phải lớn hơn 0!");
  } else if (loaiGiamGia === "phan-tram" && Number(giaTriGiam) > 100) {
    errors.push("Giảm theo phần trăm không được vượt quá 100%!");
  }

  if (soLuong !== undefined && (isNaN(soLuong) || Number(soLuong) <= 0)) {
    errors.push("Số lượng voucher phải lớn hơn 0!");
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

const doiTrangThai = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID khuyến mãi không hợp lệ!"]);
  }

  const { trangThai } = req.body;
  const danhSachHopLe = ["hoat-dong", "tam-dung", "het-han"];

  if (!trangThai || !danhSachHopLe.includes(trangThai)) {
    return traVeLoiValidate(req, res, [
      `Trạng thái voucher không hợp lệ! Phải là một trong: ${danhSachHopLe.join(", ")}`,
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
