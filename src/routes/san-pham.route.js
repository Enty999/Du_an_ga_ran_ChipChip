const express = require("express");
const router = express.Router();
const SanPham = require("../models/san-pham.model");
const DanhMuc = require("../models/danh-muc.model");
const sanPhamService = require("../services/san-pham.service");

// [GET] /thuc-don hoặc /san-pham -> Lấy danh sách món có PHÂN TRANG & LỌC TOÀN BỘ DB
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = 6; // Mỗi trang hiển thị đúng 6 món
    const danhMucSlug = req.query.danhMuc || "all";
    const tuKhoa = (req.query.q || "").trim();

    // 1. Lấy danh sách tất cả danh mục để hiển thị thanh tab
    const danhMucs = await DanhMuc.find().sort({ thuTu: 1 }).lean();

    // 2. Tìm maDanhMuc (ObjectId) nếu người dùng có bấm chọn danh mục
    let maDanhMucId = "";
    if (danhMucSlug && danhMucSlug !== "all") {
      const dmObj = danhMucs.find((d) => d.slug === danhMucSlug);
      if (dmObj) {
        maDanhMucId = dmObj._id;
      }
    }

    // 3. Gọi service truy vấn trực tiếp vào TOÀN BỘ DATABASE MongoDB
    const ketQua = await sanPhamService.layDanhSach({
      trangThai: "dang-ban",
      maDanhMuc: maDanhMucId,
      tuKhoa,
      trang: page,
      gioiHan: limit,
      sapXep: { _id: 1 },
    });

    if (req.query.ajax === "1") {
      return res.json({
        success: true,
        sanPhams: ketQua.danhSach,
        phanTrang: {
          trangHienTai: ketQua.trangHienTai,
          tongSoTrang: ketQua.tongSoTrang,
          tongSoMon: ketQua.tongSo,
        },
      });
    }
    
    res.render("pages/san-pham/thuc-don", {
      title: "Thực đơn - Gà Rán ChipChip",
      sanPhams: ketQua.danhSach,
      danhMucs,
      danhMucHienTai: danhMucSlug,
      tuKhoaHienTai: tuKhoa,
      phanTrang: {
        trangHienTai: ketQua.trangHienTai,
        tongSoTrang: ketQua.tongSoTrang,
        tongSoMon: ketQua.tongSo,
      },
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
    const sanPham = await SanPham.findOne({ slug, trangThai: "dang-ban" }).populate("maDanhMuc");

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
