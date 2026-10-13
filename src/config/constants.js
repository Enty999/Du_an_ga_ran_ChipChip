// Cấu hình Hằng số Hệ thống ChipChip - Single Source of Truth chuẩn 2026

module.exports = {
  // 1. Phân quyền người dùng (User Roles)
  VAI_TRO: {
    ADMIN: "admin",
    NHAN_VIEN: "nhan-vien",
    KHACH_HANG: "khach-hang",
  },

  // 2. Trạng thái đơn hàng (Order Statuses)
  TRANG_THAI_DON_HANG: {
    CHO_XAC_NHAN: "cho-xac-nhan",
    DANG_CHE_BIEN: "dang-che-bien",
    DANG_GIAO: "dang-giao",
    HOAN_THANH: "hoan-thanh",
    DA_HUY: "da-huy",
  },

  // 3. Trạng thái thanh toán (Payment Statuses)
  TRANG_THAI_THANH_TOAN: {
    CHUA_THANH_TOAN: "chua-thanh-toan",
    DA_THANH_TOAN: "da-thanh-toan",
    HOAN_TIEN: "hoan-tien",
  },

  // 4. Phương thức thanh toán (Payment Methods)
  PHUONG_THUC_THANH_TOAN: {
    TIEN_MAT: "tien-mat",
    CHUYEN_KHOAN: "chuyen-khoan",
    MOMO: "momo",
    VNPAY: "vnpay",
  },

  // 5. Trạng thái sản phẩm / danh mục
  TRANG_THAI_HOAT_DONG: {
    DANG_BAN: "dang-ban",
    TAM_NGUNG: "tam-ngung",
    HET_HANG: "het-hang",
    HOAT_DONG: "hoat-dong",
    KHOA: "khoa",
  },

  // 6. Cấu hình phân trang mặc định
  PHAN_TRANG_MAC_DINH: {
    TRANG: 1,
    GIOI_HAN: 10,
  },
};
