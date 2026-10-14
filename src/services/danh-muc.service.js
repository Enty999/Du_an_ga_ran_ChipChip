// Service Danh Mục: Xử lý toàn bộ nghiệp vụ liên quan đến danh mục món ăn
const DanhMuc = require("../models/danh-muc.model");
const SanPham = require("../models/san-pham.model");
const { taoSlug } = require("../utils/dinh-dang.util");

class DanhMucService {
  /**
   * Lấy tất cả danh mục (có kèm số lượng sản phẩm mỗi danh mục)
   */
  async layTatCa(dieuKien = {}, sapXep = { thuTu: 1, createdAt: -1 }) {
    const danhSach = await DanhMuc.find(dieuKien).sort(sapXep).lean();
    
    // Đếm số lượng món trong từng danh mục
    const ketQua = await Promise.all(
      danhSach.map(async (dm) => {
        const soLuongMon = await SanPham.countDocuments({ maDanhMuc: dm._id });
        return { ...dm, soLuongMon };
      })
    );

    return ketQua;
  }

  /**
   * Lấy chi tiết danh mục theo ID
   */
  async layTheoId(id) {
    return await DanhMuc.findById(id).lean();
  }

  /**
   * Lấy chi tiết danh mục theo Slug
   */
  async layTheoSlug(slug) {
    return await DanhMuc.findOne({ slug }).lean();
  }

  /**
   * Thêm mới danh mục
   */
  async taoMoi(duLieu) {
    let { tenDanhMuc, slug, moTa, bieuTuong, hinhAnh, thuTu, trangThai } = duLieu;
    
    // Slug luôn tự động sinh từ tên danh mục
    slug = taoSlug(tenDanhMuc);

    // Đảm bảo slug không trùng
    const daTonTaiSlug = await DanhMuc.findOne({ slug });
    if (daTonTaiSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return await DanhMuc.create({
      tenDanhMuc: tenDanhMuc.trim(),
      slug,
      moTa: moTa ? moTa.trim() : "",
      bieuTuong: bieuTuong || "restaurant_menu",
      hinhAnh: hinhAnh || "",
      thuTu: Number(thuTu) || 0,
      trangThai: trangThai || "hien-thi",
    });
  }

  /**
   * Cập nhật danh mục
   */
  async capNhat(id, duLieu) {
    let { tenDanhMuc, slug, moTa, bieuTuong, hinhAnh, thuTu, trangThai } = duLieu;

    // Slug tự động đồng bộ theo tên danh mục mới khi cập nhật tên
    if (tenDanhMuc && tenDanhMuc.trim() !== "") {
      let slugMoi = taoSlug(tenDanhMuc);
      const trungSlug = await DanhMuc.findOne({ slug: slugMoi, _id: { $ne: id } });
      if (trungSlug) {
        slugMoi = `${slugMoi}-${Date.now().toString().slice(-4)}`;
      }
      slug = slugMoi;
    }

    return await DanhMuc.findByIdAndUpdate(
      id,
      {
        ...(tenDanhMuc && { tenDanhMuc: tenDanhMuc.trim() }),
        ...(slug && { slug }),
        ...(moTa !== undefined && { moTa: moTa.trim() }),
        ...(bieuTuong && { bieuTuong }),
        ...(hinhAnh !== undefined && { hinhAnh }),
        ...(thuTu !== undefined && { thuTu: Number(thuTu) }),
        ...(trangThai && { trangThai }),
      },
      { returnDocument: 'after', runValidators: true }
    );
  }

  /**
   * Xóa danh mục
   */
  async xoa(id) {
    // Kiểm tra xem có món ăn nào đang thuộc danh mục này không
    const soLuongMon = await SanPham.countDocuments({ maDanhMuc: id });
    if (soLuongMon > 0) {
      throw new Error(`Không thể xóa vì danh mục đang có ${soLuongMon} món ăn liên kết!`);
    }
    return await DanhMuc.findByIdAndDelete(id);
  }

  /**
   * Đổi trạng thái nhanh danh mục (hien-thi / an)
   */
  async doiTrangThai(id, trangThaiMoi) {
    return await DanhMuc.findByIdAndUpdate(
      id,
      { trangThai: trangThaiMoi },
      { returnDocument: 'after' }
    );
  }
}

module.exports = new DanhMucService();

