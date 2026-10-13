// Utility: Chuẩn hóa định dạng phản hồi RESTful API (JSend / JSON:API specification)

/**
 * Phản hồi thành công chuẩn RESTful
 * @param {Response} res 
 * @param {number} maTrangThai - Mã HTTP status (200, 201, ...)
 * @param {string} thongBao - Mô tả thông báo
 * @param {any} duLieu - Dữ liệu trả về (object hoặc array)
 * @param {object} metadata - Thông tin bổ sung (phân trang, tổng số, timestamp)
 */
const phanHoiThanhCong = (res, maTrangThai = 200, thongBao = "Thành công", duLieu = null, metadata = null) => {
  const phanHoi = {
    success: true,
    statusCode: maTrangThai,
    message: thongBao,
    data: duLieu,
  };

  if (metadata) {
    phanHoi.meta = metadata;
  }

  return res.status(maTrangThai).json(phanHoi);
};

/**
 * Phản hồi lỗi chuẩn RESTful
 * @param {Response} res 
 * @param {number} maTrangThai - Mã HTTP status (400, 401, 403, 404, 500)
 * @param {string} thongBao - Thông báo lỗi chính
 * @param {any} chiTietLoi - Chi tiết lỗi hoặc danh sách lỗi validation
 */
const phanHoiLoi = (res, maTrangThai = 400, thongBao = "Đã xảy ra lỗi", chiTietLoi = null) => {
  const phanHoi = {
    success: false,
    statusCode: maTrangThai,
    message: thongBao,
  };

  if (chiTietLoi) {
    if (Array.isArray(chiTietLoi)) {
      phanHoi.errors = chiTietLoi;
    } else {
      phanHoi.error = chiTietLoi;
    }
  }

  return res.status(maTrangThai).json(phanHoi);
};

/**
 * Phản hồi danh sách có phân trang chuẩn Enterprise
 * @param {Response} res 
 * @param {string} thongBao 
 * @param {Array} danhSach 
 * @param {object} phanTrang - { tongSo, tongSoTrang, trangHienTai, gioiHan }
 */
const phanHoiPhanTrang = (res, thongBao, danhSach, { tongSo, tongSoTrang, trangHienTai, gioiHan }) => {
  return phanHoiThanhCong(res, 200, thongBao, danhSach, {
    pagination: {
      totalItems: tongSo,
      totalPages: tongSoTrang,
      currentPage: trangHienTai,
      pageSize: gioiHan,
      hasNextPage: trangHienTai < tongSoTrang,
      hasPrevPage: trangHienTai > 1,
    },
  });
};

module.exports = {
  phanHoiThanhCong,
  phanHoiLoi,
  phanHoiPhanTrang,
};
