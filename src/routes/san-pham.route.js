const express = require("express");
const router = express.Router();
const SanPham = require("../models/san-pham.model");
const DanhMuc = require("../models/danh-muc.model");

// [GET] /san-pham -> Lấy tất cả món ăn
router.get("/", async (req, res) => {
  try {
    const danhMucs = await DanhMuc.find().sort({ thuTu: 1 });

    const sanPhams = await SanPham.find({ trangThai: "dang-ban" }).populate("maDanhMuc");
    res.render("pages/san-pham/thuc-don", {
      title: "Thực đơn - Gà Rán ChipChip",
      sanPhams,
      danhMucs,
    });
  } catch (error) {
    res.status(500).send("Lỗi server: " + error.message);
  }
});

// [GET] /san-pham/:slug -> Lấy dữ liệu chi tiết món ăn theo slug trên URL
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Tìm món ăn trong MongoDB Atlas theo slug
    const sanPham = await SanPham.findOne({ slug, trangThai: "dang-ban" });

    // Nếu không tìm thấy món ăn (hoặc gõ sai link)
    if (!sanPham) {
      return res.status(404).render("pages/trang-chu/trang-chu", {
        title: "Không tìm thấy món ăn",
      });
    }

    // Dùng $sample để bốc NGẪU NHIÊN 3 món khác nhau mỗi lần tải trang
    const monGoiY = await SanPham.aggregate([
      { $match: { _id: { $ne: sanPham._id }, trangThai: "dang-ban" } },
      { $sample: { size: 3 } }
    ]);

    // Truyền cả món chính và các món gợi ý sang view
    res.render("pages/san-pham/chi-tiet", {
      title: `${sanPham.tenSanPham} - Gà Rán ChipChip`,
      sanPham,
      monGoiY,
    });
  } catch (error) {
    res.status(500).send("Lỗi server: " + error.message);
  }
});

module.exports = router;
