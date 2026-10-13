// Script khởi tạo dữ liệu mẫu (Seeder) cho hệ thống ChipChip
// Chạy lệnh: node src/scripts/khoi-tao-du-lieu.js
require("dotenv").config();
const mongoose = require("mongoose");
const connectDatabase = require("../config/database");

const NguoiDung = require("../models/nguoi-dung.model");
const DanhMuc = require("../models/danh-muc.model");
const SanPham = require("../models/san-pham.model");
const DonHang = require("../models/don-hang.model");
const KhuyenMai = require("../models/khuyen-mai.model");

const khoiTaoDuLieu = async () => {
  try {
    console.log("=== BẮT ĐẦU KHỞI TẠO & NẠP DỮ LIỆU CHIPCHIP ===");
    await connectDatabase();

    // 1. Khởi tạo / Cập nhật tài khoản Admin với mật khẩu admin123
    console.log("\n1. Khởi tạo tài khoản Quản trị viên (Admin) với pass 'admin123'...");
    
    // Tạo / cập nhật admin@chipchip.vn
    let admin = await NguoiDung.findOne({ email: "admin@chipchip.vn" });
    if (!admin) {
      admin = new NguoiDung({
        hoTen: "Quản Trị Viên ChipChip",
        email: "admin@chipchip.vn",
        password: "admin123",
        SDT: "0901234567",
        diaChi: "Số 123 Nguyễn Thị Thập, Phường Tân Hưng, Quận 7, TP.HCM",
        ghiChuGiaoHang: "Văn phòng quản trị ChipChip",
        vaiTro: "admin",
        trangThai: "hoat-dong",
      });
      await admin.save();
      console.log("-> Tạo thành công Admin: admin@chipchip.vn / admin123");
    } else {
      admin.password = "admin123";
      admin.vaiTro = "admin";
      admin.trangThai = "hoat-dong";
      await admin.save();
      console.log("-> Cập nhật mật khẩu Admin admin@chipchip.vn thành: admin123");
    }

    // Tạo thêm admin@gmail.com với pass admin123 để tiện đăng nhập
    let adminGmail = await NguoiDung.findOne({ email: "admin@gmail.com" });
    if (!adminGmail) {
      adminGmail = new NguoiDung({
        hoTen: "Admin Dự Phòng",
        email: "admin@gmail.com",
        password: "admin123",
        SDT: "0909998877",
        diaChi: "Trụ sở ChipChip Chicken",
        vaiTro: "admin",
        trangThai: "hoat-dong",
      });
      await adminGmail.save();
      console.log("-> Tạo thành công Admin phụ: admin@gmail.com / admin123");
    } else {
      adminGmail.password = "admin123";
      adminGmail.vaiTro = "admin";
      adminGmail.trangThai = "hoat-dong";
      await adminGmail.save();
      console.log("-> Cập nhật mật khẩu admin@gmail.com thành: admin123");
    }

    // Tạo tài khoản Nhân viên và Khách hàng mẫu
    let nhanVien = await NguoiDung.findOne({ email: "nhanvien@chipchip.vn" });
    if (!nhanVien) {
      nhanVien = new NguoiDung({
        hoTen: "Nguyễn Văn Bếp",
        email: "nhanvien@chipchip.vn",
        password: "admin123",
        SDT: "0912888999",
        diaChi: "Bếp trung tâm ChipChip",
        vaiTro: "nhan-vien",
        trangThai: "hoat-dong",
      });
      await nhanVien.save();
      console.log("-> Tạo Nhân viên: nhanvien@chipchip.vn / admin123");
    }

    let khachHang1 = await NguoiDung.findOne({ email: "khachhang@gmail.com" });
    if (!khachHang1) {
      khachHang1 = new NguoiDung({
        hoTen: "Lê Hoàng Yến",
        email: "khachhang@gmail.com",
        password: "admin123",
        SDT: "0987654321",
        diaChi: "Toà Bitexco, Số 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM",
        ghiChuGiaoHang: "Giao sảnh tầng trệt",
        vaiTro: "khach-hang",
        trangThai: "hoat-dong",
      });
      await khachHang1.save();
      console.log("-> Tạo Khách hàng mẫu: khachhang@gmail.com / admin123");
    }

    // 2. Khởi tạo Danh mục món ăn
    console.log("\n2. Khởi tạo Danh mục món ăn...");
    const danhMucMau = [
      {
        tenDanhMuc: "Gà sốt đậm vị",
        slug: "ga-sot-dam-vi",
        moTa: "Các món gà chiên giòn quyện sốt cay ngọt, sốt phô mai, bơ tỏi đặc quyền.",
        bieuTuong: "lunch_dining",
        thuTu: 1,
      },
      {
        tenDanhMuc: "Gà truyền thống giòn da",
        slug: "ga-truyen-thong-gion-da",
        moTa: "Đùi và cánh gà rán vàng ruộm nổ rụm, thịt bên trong mềm mọng thơm thảo mộc.",
        bieuTuong: "kebab_dining",
        thuTu: 2,
      },
      {
        tenDanhMuc: "Burger & Món phụ",
        slug: "burger-va-mon-phu",
        moTa: "Burger brioche kẹp gà rán, khoai tây lắc rong biển, phô mai que...",
        bieuTuong: "fastfood",
        thuTu: 3,
      },
      {
        tenDanhMuc: "Đồ uống mát lạnh",
        slug: "do-uong-mat-lanh",
        moTa: "Trà đào hạt chia, trà chanh sả, nước ngọt giải ngấy tuyệt hảo.",
        bieuTuong: "local_drink",
        thuTu: 4,
      },
      {
        tenDanhMuc: "Combo Tiết Kiệm",
        slug: "combo-tiet-kiem",
        moTa: "Set combo đầy đặn gồm gà rán, khoai tây và nước với giá siêu ưu đãi.",
        bieuTuong: "takeout_dining",
        thuTu: 5,
      },
    ];

    const mapDanhMuc = {};
    for (const dm of danhMucMau) {
      let tonTai = await DanhMuc.findOne({ slug: dm.slug });
      if (!tonTai) {
        tonTai = await DanhMuc.create(dm);
        console.log(`-> Tạo danh mục: ${dm.tenDanhMuc}`);
      }
      mapDanhMuc[dm.slug] = tonTai._id;
    }

    // 3. Khởi tạo Món ăn / Gà rán
    console.log("\n3. Khởi tạo Thực đơn Món ăn...");
    const sanPhamMau = [
      {
        tenSanPham: "Gà Cay Sốt Cay Ngọt Seoul",
        slug: "ga-cay-sot-cay-ngot-seoul",
        maDanhMuc: mapDanhMuc["ga-sot-dam-vi"],
        giaGoc: 45000,
        giaKhuyenMai: 42000,
        khauPhan: "2 miếng",
        tenTiengAnh: "Seoul Yangnyeom Crisp",
        moTa: "Lớp vỏ giòn tan quyện đều sốt ớt Hàn Quốc ngọt dịu, thơm bùi mè rang và đậu phộng rang giòn.",
        hinhAnh: "/images/trang-chu/thuc-don-01.jpg",
        huyHieu: "Bán chạy nhất",
        loaiHuyHieu: "secondary",
        noiBat: true,
        banChay: true,
        daBan: 215,
        soLuongTon: 150,
      },
      {
        tenSanPham: "Đùi Gà Rán Giòn Rụm Da Vàng",
        slug: "dui-ga-ran-gion-rum-da-vang",
        maDanhMuc: mapDanhMuc["ga-truyen-thong-gion-da"],
        giaGoc: 38000,
        giaKhuyenMai: 0,
        khauPhan: "1 Đùi lớn",
        tenTiengAnh: "Golden Crispy Drumstick",
        moTa: "Đùi góc tư ướp muối tiêu và thảo mộc, lớp da nổ giòn tan không ngấy dầu, thịt bên trong ngọt đậm đà.",
        hinhAnh: "/images/trang-chu/thuc-don-02.jpg",
        huyHieu: "Siêu giòn",
        loaiHuyHieu: "amber",
        noiBat: true,
        banChay: true,
        daBan: 189,
        soLuongTon: 120,
      },
      {
        tenSanPham: "Cánh Gà Lắc Phô Mai Béo Ngậy",
        slug: "canh-ga-lac-pho-mai-beo-ngay",
        maDanhMuc: mapDanhMuc["ga-sot-dam-vi"],
        giaGoc: 52000,
        giaKhuyenMai: 49000,
        khauPhan: "4 Cánh",
        tenTiengAnh: "Snowy Cheddar Wings",
        moTa: "Cánh gà chiên giòn tan lắc đều lớp bột phô mai Cheddar béo bùi, vị mặn ngọt hài hòa cuốn hút.",
        hinhAnh: "/images/trang-chu/thuc-don-03.jpg",
        huyHieu: "Trẻ em yêu thích",
        loaiHuyHieu: "primary-container",
        noiBat: true,
        banChay: false,
        daBan: 142,
        soLuongTon: 90,
      },
      {
        tenSanPham: "Combo ChipChip Thỏa Thích",
        slug: "combo-chipchip-thoa-thich",
        maDanhMuc: mapDanhMuc["combo-tiet-kiem"],
        giaGoc: 104000,
        giaKhuyenMai: 79000,
        khauPhan: "Tiết kiệm 25k",
        tenTiengAnh: "ChipChip Feast Combo",
        moTa: "Gồm 2 miếng gà rán giòn sốt tự chọn + 1 phần khoai tây lắc rong biển + 1 ly trà đào hạt chia thanh mát.",
        hinhAnh: "/images/trang-chu/thuc-don-04.jpg",
        huyHieu: "Combo Tiết Kiệm",
        loaiHuyHieu: "crimson",
        noiBat: true,
        banChay: true,
        daBan: 320,
        soLuongTon: 80,
      },
      {
        tenSanPham: "Khoai Tây Lắc Rong Biển",
        slug: "khoai-tay-lac-rong-bien",
        maDanhMuc: mapDanhMuc["burger-va-mon-phu"],
        giaGoc: 25000,
        giaKhuyenMai: 0,
        khauPhan: "1 Hộp",
        tenTiengAnh: "Seaweed Shaker Fries",
        moTa: "Khoai tây nhập khẩu cắn giòn xốp, kết hợp gia vị rong biển rang muối ớt Nhật Bản thơm nồng.",
        hinhAnh: "/images/trang-chu/thuc-don-05.jpg",
        huyHieu: "Món ăn kèm",
        loaiHuyHieu: "amber",
        noiBat: false,
        banChay: false,
        daBan: 95,
        soLuongTon: 200,
      },
      {
        tenSanPham: "Burger Gà Giòn Sốt Mayo Cay",
        slug: "burger-ga-gion-sot-mayo-cay",
        maDanhMuc: mapDanhMuc["burger-va-mon-phu"],
        giaGoc: 39000,
        giaKhuyenMai: 0,
        khauPhan: "1 Chiếc",
        tenTiengAnh: "Crispy Chicky Brioche Burger",
        moTa: "Vỏ bánh Brioche bơ thơm lừng kẹp thịt ức gà đùi chiên giòn, bắp cải tím muối giòn cùng sốt mayonnaise cay độc quyền.",
        hinhAnh: "/images/trang-chu/thuc-don-06.jpg",
        huyHieu: "Món no bụng",
        loaiHuyHieu: "primary",
        noiBat: true,
        banChay: false,
        daBan: 110,
        soLuongTon: 65,
      },
      {
        tenSanPham: "Trà Đào Hạt Chia Mát Lạnh",
        slug: "tra-dao-hat-chia-mat-lanh",
        maDanhMuc: mapDanhMuc["do-uong-mat-lanh"],
        giaGoc: 22000,
        giaKhuyenMai: 0,
        khauPhan: "Ly lớn 500ml",
        tenTiengAnh: "Iced Peach Chia Tea",
        moTa: "Trà đen ủ lạnh ngát hương đào tươi cùng miếng đào giòn sần sật và hạt chia thanh nhiệt giải ngấy.",
        hinhAnh: "/images/trang-chu/hero-04.jpg",
        huyHieu: "Giải nhiệt hè",
        loaiHuyHieu: "info",
        noiBat: false,
        banChay: true,
        daBan: 175,
        soLuongTon: 300,
      },
    ];

    const mapSanPham = {};
    for (const sp of sanPhamMau) {
      let tonTai = await SanPham.findOne({ slug: sp.slug });
      if (!tonTai) {
        tonTai = await SanPham.create(sp);
        console.log(`-> Tạo món ăn: ${sp.tenSanPham}`);
      } else {
        // Cập nhật để hình ảnh và giá luôn chuẩn
        Object.assign(tonTai, sp);
        await tonTai.save();
      }
      mapSanPham[sp.slug] = tonTai;
    }

    // 4. Khởi tạo Mã Khuyến Mãi
    console.log("\n4. Khởi tạo Mã khuyến mãi...");
    const khuyenMaiMau = [
      {
        maCode: "CHIPCHIPVIP",
        tieuDe: "Giảm 20.000đ cho thành viên thân thiết",
        moTa: "Áp dụng cho mọi đơn hàng gà rán từ 100.000đ trở lên.",
        loaiGiamGia: "tien-mat",
        giaTriGiam: 20000,
        donHangToiThieu: 100000,
        soLuong: 500,
        daSuDung: 32,
        trangThai: "hoat-dong",
      },
      {
        maCode: "CHIPCHIPHE",
        tieuDe: "Ưu đãi chào hè giảm 15%",
        moTa: "Giảm ngay 15% tổng hóa đơn, tối đa 30.000đ.",
        loaiGiamGia: "phan-tram",
        giaTriGiam: 15,
        giamToiDa: 30000,
        donHangToiThieu: 80000,
        soLuong: 200,
        daSuDung: 45,
        trangThai: "hoat-dong",
      },
      {
        maCode: "FREESHIP",
        tieuDe: "Miễn phí vận chuyển 15k",
        moTa: "Freeship cho đơn hàng từ 60.000đ.",
        loaiGiamGia: "tien-mat",
        giaTriGiam: 15000,
        donHangToiThieu: 60000,
        soLuong: 1000,
        daSuDung: 88,
        trangThai: "hoat-dong",
      },
    ];

    for (const km of khuyenMaiMau) {
      const tonTai = await KhuyenMai.findOne({ maCode: km.maCode });
      if (!tonTai) {
        await KhuyenMai.create(km);
        console.log(`-> Tạo khuyến mãi: ${km.maCode}`);
      }
    }

    // 5. Khởi tạo Đơn hàng mẫu đa dạng trạng thái để test Admin Dashboard
    console.log("\n5. Khởi tạo Đơn hàng mẫu...");
    const sp1 = mapSanPham["ga-cay-sot-cay-ngot-seoul"];
    const sp2 = mapSanPham["combo-chipchip-thoa-thich"];
    const sp3 = mapSanPham["dui-ga-ran-gion-rum-da-vang"];
    const sp4 = mapSanPham["khoai-tay-lac-rong-bien"];
    const sp6 = mapSanPham["burger-ga-gion-sot-mayo-cay"];
    const sp7 = mapSanPham["tra-dao-hat-chia-mat-lanh"];

    // Xóa các đơn cũ để nạp bộ đơn hàng test chuẩn đẹp
    await DonHang.deleteMany({});

    const donHangMau = [
      {
        maDonHang: "CC-261013-1001",
        maNguoiDung: admin._id,
        thongTinNguoiNhan: {
          hoTen: "Trần Minh Quân",
          soDienThoai: "0908123456",
          diaChi: "Số 45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
          ghiChu: "Giao trước 12h trưa giúp mình nhé, thêm nhiều tương ớt",
        },
        danhSachMon: [
          {
            maSanPham: sp2._id,
            tenSanPham: sp2.tenSanPham,
            hinhAnh: sp2.hinhAnh,
            gia: 79000,
            soLuong: 2,
            thanhTien: 158000,
          },
          {
            maSanPham: sp4._id,
            tenSanPham: sp4.tenSanPham,
            hinhAnh: sp4.hinhAnh,
            gia: 25000,
            soLuong: 1,
            thanhTien: 25000,
          },
        ],
        tongTienMon: 183000,
        phiVanChuyen: 15000,
        maGiamGia: "CHIPCHIPVIP",
        tienGiamGia: 20000,
        tongThanhToan: 178000,
        phuongThucThanhToan: "tien-mat",
        trangThaiThanhToan: "da-thanh-toan",
        trangThaiDonHang: "da-giao",
      },
      {
        maDonHang: "CC-261013-1002",
        maNguoiDung: khachHang1._id,
        thongTinNguoiNhan: {
          hoTen: "Lê Hoàng Yến",
          soDienThoai: "0987654321",
          diaChi: "Toà Bitexco, Số 2 Hải Triều, Bến Nghé, Quận 1, TP.HCM",
          ghiChu: "Gọi điện trước khi đến 5 phút",
        },
        danhSachMon: [
          {
            maSanPham: sp1._id,
            tenSanPham: sp1.tenSanPham,
            hinhAnh: sp1.hinhAnh,
            gia: 42000,
            soLuong: 3,
            thanhTien: 126000,
          },
          {
            maSanPham: sp7._id,
            tenSanPham: sp7.tenSanPham,
            hinhAnh: sp7.hinhAnh,
            gia: 22000,
            soLuong: 2,
            thanhTien: 44000,
          },
        ],
        tongTienMon: 170000,
        phiVanChuyen: 15000,
        maGiamGia: "CHIPCHIPHE",
        tienGiamGia: 25500,
        tongThanhToan: 159500,
        phuongThucThanhToan: "tien-mat",
        trangThaiThanhToan: "chua-thanh-toan",
        trangThaiDonHang: "dang-giao",
      },
      {
        maDonHang: "CC-261013-1003",
        maNguoiDung: null,
        thongTinNguoiNhan: {
          hoTen: "Hoàng Gia Bảo",
          soDienThoai: "0918765432",
          diaChi: "Số 88 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM",
          ghiChu: "Gà rán nóng hổi, để ở bàn bảo vệ",
        },
        danhSachMon: [
          {
            maSanPham: sp3._id,
            tenSanPham: sp3.tenSanPham,
            hinhAnh: sp3.hinhAnh,
            gia: 38000,
            soLuong: 4,
            thanhTien: 152000,
          },
        ],
        tongTienMon: 152000,
        phiVanChuyen: 15000,
        maGiamGia: "FREESHIP",
        tienGiamGia: 15000,
        tongThanhToan: 152000,
        phuongThucThanhToan: "chuyen-khoan",
        trangThaiThanhToan: "chua-thanh-toan",
        trangThaiDonHang: "cho-xac-nhan",
      },
      {
        maDonHang: "CC-261013-1004",
        maNguoiDung: null,
        thongTinNguoiNhan: {
          hoTen: "Vũ Thị Mai",
          soDienThoai: "0945112233",
          diaChi: "105 Cống Quỳnh, Phạm Ngũ Lão, Quận 1",
          ghiChu: "Không cay nha quán",
        },
        danhSachMon: [
          {
            maSanPham: sp6._id,
            tenSanPham: sp6.tenSanPham,
            hinhAnh: sp6.hinhAnh,
            gia: 39000,
            soLuong: 2,
            thanhTien: 78000,
          },
          {
            maSanPham: sp4._id,
            tenSanPham: sp4.tenSanPham,
            hinhAnh: sp4.hinhAnh,
            gia: 25000,
            soLuong: 2,
            thanhTien: 50000,
          },
        ],
        tongTienMon: 128000,
        phiVanChuyen: 15000,
        maGiamGia: "",
        tienGiamGia: 0,
        tongThanhToan: 143000,
        phuongThucThanhToan: "momo",
        trangThaiThanhToan: "da-thanh-toan",
        trangThaiDonHang: "dang-che-bien",
      },
      {
        maDonHang: "CC-261013-1005",
        maNguoiDung: null,
        thongTinNguoiNhan: {
          hoTen: "Đỗ Tuấn Kiệt",
          soDienThoai: "0977223344",
          diaChi: "Số 12 Tôn Đản, Phường 13, Quận 4",
          ghiChu: "Khách gọi hủy vì đổi kế hoạch",
        },
        danhSachMon: [
          {
            maSanPham: sp1._id,
            tenSanPham: sp1.tenSanPham,
            hinhAnh: sp1.hinhAnh,
            gia: 42000,
            soLuong: 1,
            thanhTien: 42000,
          },
        ],
        tongTienMon: 42000,
        phiVanChuyen: 15000,
        maGiamGia: "",
        tienGiamGia: 0,
        tongThanhToan: 57000,
        phuongThucThanhToan: "tien-mat",
        trangThaiThanhToan: "chua-thanh-toan",
        trangThaiDonHang: "da-huy",
        lyDoHuy: "Khách đổi ý hủy đơn",
      },
    ];

    for (const d of donHangMau) {
      await DonHang.create(d);
      console.log(`-> Tạo đơn hàng mẫu: ${d.maDonHang} (${d.trangThaiDonHang})`);
    }

    console.log("\n=== NẠP DỮ LIỆU HOÀN TẤT THÀNH CÔNG 100%! ===");
    console.log("-------------------------------------------------");
    console.log("🎯 TÀI KHOẢN ĐĂNG NHẬP ADMIN:");
    console.log("   • Cách 1: Email: admin@chipchip.vn  |  Pass: admin123");
    console.log("   • Cách 2: Email: admin@gmail.com     |  Pass: admin123");
    console.log("   • Cách 3: Nhập chữ: admin            |  Pass: admin123");
    console.log("   • Đường dẫn: http://localhost:3000/admin");
    console.log("-------------------------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("LỖI KHỞI TẠO DỮ LIỆU:", error);
    process.exit(1);
  }
};

khoiTaoDuLieu();
