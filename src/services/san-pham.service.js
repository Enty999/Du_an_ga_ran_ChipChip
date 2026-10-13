// Service Sản Phẩm: Xử lý toàn bộ nghiệp vụ món ăn / gà rán ChipChip
const SanPham = require("../models/san-pham.model");
const DanhMuc = require("../models/danh-muc.model");
const { taoSlug } = require("../utils/dinh-dang.util");

class SanPhamService {
  /**
   * Lấy danh sách sản phẩm có bộ lọc, tìm kiếm, phân trang
   */
  async layDanhSach({
    tuKhoa = "",
    maDanhMuc = "",
    trangThai = "",
    noiBat,
    banChay,
    trang = 1,
    gioiHan = 10,
    sapXep = { createdAt: -1 },
  } = {}) {
    const dieuKien = {};

    // Tìm kiếm theo tên hoặc tên tiếng Anh
    if (tuKhoa && tuKhoa.trim() !== "") {
      const reg = new RegExp(tuKhoa.trim(), "i");
      dieuKien.$or = [{ tenSanPham: reg }, { tenTiengAnh: reg }];
    }

    // Lọc theo danh mục
    if (maDanhMuc && maDanhMuc !== "tat-ca") {
      dieuKien.maDanhMuc = maDanhMuc;
    }

    // Lọc theo trạng thái
    if (trangThai && trangThai !== "tat-ca") {
      dieuKien.trangThai = trangThai;
    }

    // Lọc theo nổi bật / bán chạy
    if (noiBat !== undefined) dieuKien.noiBat = Boolean(noiBat);
    if (banChay !== undefined) dieuKien.banChay = Boolean(banChay);

    const tongSo = await SanPham.countDocuments(dieuKien);
    const tongSoTrang = Math.ceil(tongSo / gioiHan) || 1;
    const trangHienTai = Math.max(1, Math.min(Number(trang), tongSoTrang));
    const boQua = (trangHienTai - 1) * gioiHan;

    const danhSach = await SanPham.find(dieuKien)
      .populate("maDanhMuc", "tenDanhMuc slug")
      .sort(sapXep)
      .skip(boQua)
      .limit(gioiHan)
      .lean();

    return {
      danhSach,
      tongSo,
      tongSoTrang,
      trangHienTai,
      gioiHan,
    };
  }

  /**
   * Lấy chi tiết món ăn theo ID
   */
  async layTheoId(id) {
    return await SanPham.findById(id).populate("maDanhMuc").lean();
  }

  /**
   * Lấy chi tiết món ăn theo Slug
   */
  async layTheoSlug(slug) {
    return await SanPham.findOne({ slug }).populate("maDanhMuc").lean();
  }

  /**
   * Tạo món ăn mới
   */
  async taoMoi(duLieu) {
    let {
      tenSanPham,
      slug,
      maDanhMuc,
      giaGoc,
      giaKhuyenMai,
      khauPhan,
      tenTiengAnh,
      moTa,
      hinhAnh,
      huyHieu,
      loaiHuyHieu,
      noiBat,
      banChay,
      soLuongTon,
      trangThai,
    } = duLieu;

    if (!slug || slug.trim() === "") {
      slug = taoSlug(tenSanPham);
    } else {
      slug = taoSlug(slug);
    }

    // Đảm bảo slug là duy nhất
    const daCoSlug = await SanPham.findOne({ slug });
    if (daCoSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await SanPham.create({
      tenSanPham: tenSanPham.trim(),
      slug,
      maDanhMuc,
      giaGoc: Number(giaGoc) || 0,
      giaKhuyenMai: Number(giaKhuyenMai) || 0,
      khauPhan: khauPhan ? khauPhan.trim() : "1 phần",
      tenTiengAnh: tenTiengAnh ? tenTiengAnh.trim() : "",
      moTa: moTa ? moTa.trim() : "",
      hinhAnh: hinhAnh ? hinhAnh.trim() : "/images/trang-chu/thuc-don-01.jpg",
      huyHieu: huyHieu ? huyHieu.trim() : "",
      loaiHuyHieu: loaiHuyHieu || "secondary",
      noiBat: noiBat === true || noiBat === "on" || noiBat === "true",
      banChay: banChay === true || banChay === "on" || banChay === "true",
      soLuongTon: Number(soLuongTon) || 100,
      trangThai: trangThai || "dang-ban",
    });
  }

  /**
   * Cập nhật món ăn
   */
  async capNhat(id, duLieu) {
    let {
      tenSanPham,
      slug,
      maDanhMuc,
      giaGoc,
      giaKhuyenMai,
      khauPhan,
      tenTiengAnh,
      moTa,
      hinhAnh,
      huyHieu,
      loaiHuyHieu,
      noiBat,
      banChay,
      soLuongTon,
      trangThai,
    } = duLieu;

    const duLieuCapNhat = {
      ...(tenSanPham && { tenSanPham: tenSanPham.trim() }),
      ...(maDanhMuc && { maDanhMuc }),
      ...(giaGoc !== undefined && { giaGoc: Number(giaGoc) }),
      ...(giaKhuyenMai !== undefined && { giaKhuyenMai: Number(giaKhuyenMai) }),
      ...(khauPhan !== undefined && { khauPhan: khauPhan.trim() }),
      ...(tenTiengAnh !== undefined && { tenTiengAnh: tenTiengAnh.trim() }),
      ...(moTa !== undefined && { moTa: moTa.trim() }),
      ...(hinhAnh !== undefined && { hinhAnh: hinhAnh.trim() }),
      ...(huyHieu !== undefined && { huyHieu: huyHieu.trim() }),
      ...(loaiHuyHieu && { loaiHuyHieu }),
      noiBat: noiBat === true || noiBat === "on" || noiBat === "true",
      banChay: banChay === true || banChay === "on" || banChay === "true",
      ...(soLuongTon !== undefined && { soLuongTon: Number(soLuongTon) }),
      ...(trangThai && { trangThai }),
    };

    if (slug) {
      slug = taoSlug(slug);
      const trungSlug = await SanPham.findOne({ slug, _id: { $ne: id } });
      if (trungSlug) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      duLieuCapNhat.slug = slug;
    }

    return await SanPham.findByIdAndUpdate(id, duLieuCapNhat, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Xóa món ăn
   */
  async xoa(id) {
    return await SanPham.findByIdAndDelete(id);
  }

  /**
   * Đổi trạng thái nhanh (dang-ban, het-hang, ngung-ban)
   */
  async doiTrangThai(id, trangThaiMoi) {
    return await SanPham.findByIdAndUpdate(
      id,
      { trangThai: trangThaiMoi },
      { new: true }
    );
  }
}

module.exports = new SanPhamService();
