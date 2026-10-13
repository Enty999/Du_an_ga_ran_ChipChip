// Utility định dạng dữ liệu cho toàn bộ website và trang quản trị ChipChip

/**
 * Định dạng số thành chuỗi tiền tệ Việt Nam (VNĐ)
 * Ví dụ: 45000 -> "45.000đ"
 */
const dinhDangTien = (soTien) => {
  if (soTien === undefined || soTien === null || isNaN(soTien)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(Number(soTien)) + "đ";
};

/**
 * Định dạng ngày giờ chuẩn Việt Nam (DD/MM/YYYY hoặc DD/MM/YYYY HH:mm)
 */
const dinhDangNgay = (ngay, baoGomGio = true) => {
  if (!ngay) return "";
  const d = new Date(ngay);
  if (isNaN(d.getTime())) return "";

  const ngayStr = String(d.getDate()).padStart(2, "0");
  const thangStr = String(d.getMonth() + 1).padStart(2, "0");
  const namStr = d.getFullYear();

  if (!baoGomGio) {
    return `${ngayStr}/${thangStr}/${namStr}`;
  }

  const gioStr = String(d.getHours()).padStart(2, "0");
  const phutStr = String(d.getMinutes()).padStart(2, "0");

  return `${ngayStr}/${thangStr}/${namStr} ${gioStr}:${phutStr}`;
};

/**
 * Tạo slug chuẩn từ tiếng Việt có dấu
 * Ví dụ: "Gà Sốt Cay Ngọt Seoul 123" -> "ga-sot-cay-ngot-seoul-123"
 */
const taoSlug = (chuoi) => {
  if (!chuoi) return "";
  let str = chuoi.toString().toLowerCase().trim();

  // Đổi ký tự có dấu thành không dấu
  str = str
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a")
    .replace(/[éèẻẽẹêếềểễệ]/g, "e")
    .replace(/[íìỉĩị]/g, "i")
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[úùủũụưứừửữự]/g, "u")
    .replace(/[ýỳỷỹỵ]/g, "y")
    .replace(/đ/g, "d");

  // Xóa ký tự đặc biệt, thay khoảng trắng bằng gạch nối
  str = str
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return str;
};

/**
 * Sinh mã đơn hàng ngẫu nhiên duy nhất
 * Ví dụ: CC-261013-8921
 */
const taoMaDonHang = () => {
  const d = new Date();
  const nam = String(d.getFullYear()).slice(-2);
  const thang = String(d.getMonth() + 1).padStart(2, "0");
  const ngay = String(d.getDate()).padStart(2, "0");
  const ngauNhien = Math.floor(1000 + Math.random() * 9000);
  return `CC-${nam}${thang}${ngay}-${ngauNhien}`;
};

module.exports = {
  dinhDangTien,
  dinhDangNgay,
  taoSlug,
  taoMaDonHang,
};
