// Controller Trang Chủ: Điều phối dữ liệu hiển thị trang chủ website
const sanPhamService = require("../services/san-pham.service");
const danhMucService = require("../services/danh-muc.service");
const { dinhDangTien } = require("../utils/dinh-dang.util");

/**
 * [GET] /
 * Trang chủ - Gà Rán ChipChip
 */
const renderTrangChu = async (req, res) => {
  try {
    const [danhMucList, ketQuaSanPham] = await Promise.all([
      danhMucService.layTatCa({ trangThai: "hien-thi" }),
      sanPhamService.layDanhSach({
        trangThai: "dang-ban",
        gioiHan: 12,
        sapXep: { noiBat: -1, daBan: -1, createdAt: -1 },
      }),
    ]);

    res.render("pages/trang-chu/trang-chu", {
      title: "Trang chủ - Gà Rán ChipChip",
      danhMucList,
      sanPhamList: ketQuaSanPham.danhSach,
      dinhDangTien,
    });
  } catch (error) {
    console.error("Lỗi tải trang chủ:", error);
    res.render("pages/trang-chu/trang-chu", {
      title: "Trang chủ - Gà Rán ChipChip",
      danhMucList: [],
      sanPhamList: [],
      dinhDangTien,
    });
  }
};

module.exports = {
  renderTrangChu,
};
