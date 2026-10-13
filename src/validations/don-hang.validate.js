// Middleware Validate Đơn Hàng ChipChip
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
  const referer = req.get("Referer") || "/admin/don-hang";
  const separator = referer.includes("?") ? "&" : "?";
  return res.redirect(`${referer}${separator}loi=${encodeURIComponent(loiList[0])}`);
};

const idHopLe = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID đơn hàng không hợp lệ!"]);
  }
  next();
};

const capNhatTrangThai = (req, res, next) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return traVeLoiValidate(req, res, ["ID đơn hàng không hợp lệ!"]);
  }

  const { trangThaiDonHang, trangThaiThanhToan } = req.body;
  const errors = [];

  const dsTrangThaiDH = [
    "cho-xac-nhan",
    "da-xac-nhan",
    "dang-che-bien",
    "dang-giao",
    "da-giao",
    "da-huy",
  ];

  if (trangThaiDonHang && !dsTrangThaiDH.includes(trangThaiDonHang)) {
    errors.push(`Trạng thái đơn hàng không hợp lệ! Phải là một trong: ${dsTrangThaiDH.join(", ")}`);
  }

  const dsTrangThaiTT = ["chua-thanh-toan", "da-thanh-toan"];
  if (trangThaiThanhToan && !dsTrangThaiTT.includes(trangThaiThanhToan)) {
    errors.push(`Trạng thái thanh toán không hợp lệ! Phải là 'chua-thanh-toan' hoặc 'da-thanh-toan'`);
  }

  if (errors.length > 0) {
    return traVeLoiValidate(req, res, errors);
  }

  next();
};

module.exports = {
  idHopLe,
  capNhatTrangThai,
};
