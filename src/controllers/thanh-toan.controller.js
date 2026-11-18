// Controller xử lý luồng thanh toán và tạo đơn hàng ChipChip
const donHangService = require("../services/don-hang.service");
const DonHang = require("../models/don-hang.model");
const KhuyenMai = require("../models/khuyen-mai.model");
const SanPham = require("../models/san-pham.model");

class ThanhToanController {
  /**
   * Hiển thị giao diện trang thanh toán
   * GET /thanh-toan
   */
  async renderTrangThanhToan(req, res) {
    try {
      const nguoiDung = res.locals.nguoiDung || null;
      res.render("pages/thanh-toan/thanh-toan", {
        title: "Thanh toán đơn hàng",
        nguoiDung,
      });
    } catch (error) {
      console.error("[LỖI RENDER THANH TOÁN]:", error);
      res.status(500).send("Có lỗi xảy ra khi tải trang thanh toán");
    }
  }

  /**
   * Xử lý gửi đơn hàng (Submit form đặt hàng)
   * POST /thanh-toan
   */
  async xuLyDatHang(req, res) {
    try {
      const {
        hoTen,
        soDienThoai,
        email,
        diaChi,
        ghiChu,
        phuongThucThanhToan,
        danhSachMonJson,
        maGiamGia,
      } = req.body;

      let danhSachMon = [];
      try {
        danhSachMon = JSON.parse(danhSachMonJson || "[]");
      } catch (err) {
        return res.status(400).json({ thanhCong: false, thongBao: "Dữ liệu giỏ hàng không hợp lệ" });
      }

      if (!danhSachMon || danhSachMon.length === 0) {
        return res.status(400).json({ thanhCong: false, thongBao: "Giỏ hàng của bạn đang trống" });
      }

      const danhSachMonChuanHoa = danhSachMon.map((item) => ({
        maSanPham: item.id,
        soLuong: Number(item.soLuong) || 1,
      }));

            // Kiểm tra tính tiền giảm giá thật từ Database
      let tienGiamGia = 0;
      let maGiamGiaChuan = "";
      if (maGiamGia && maGiamGia.trim()) {
        const voucher = await KhuyenMai.findOne({
          maCode: maGiamGia.trim().toUpperCase(),
          trangThai: "hoat-dong",
        });
        if (voucher) {
          // Tính tổng tiền các món từ giá thật trong DB
          let tongTienMon = 0;
          for (const item of danhSachMonChuanHoa) {
            const sp = await SanPham.findById(item.maSanPham);
            if (sp) {
              const gia = (sp.giaKhuyenMai && sp.giaKhuyenMai > 0) ? sp.giaKhuyenMai : sp.giaGoc;
              tongTienMon += gia * item.soLuong;
            }
          }

          // Kiểm tra điều kiện đơn hàng tối thiểu
          if (tongTienMon >= (voucher.donHangToiThieu || 0)) {
            maGiamGiaChuan = voucher.maCode;
            if (voucher.loaiGiamGia === "phan-tram") {
              tienGiamGia = Math.round((tongTienMon * voucher.giaTriGiam) / 100);
              if (voucher.giamToiDa > 0 && tienGiamGia > voucher.giamToiDa) {
                tienGiamGia = voucher.giamToiDa;
              }
            } else {
              tienGiamGia = voucher.giaTriGiam;
            }
            // Tăng số lượt đã sử dụng của mã
            await KhuyenMai.findByIdAndUpdate(voucher._id, { $inc: { daSuDung: 1 } });
          }
        }
      }

      const donHangMoi = await donHangService.taoDonHang({
        maNguoiDung: res.locals.nguoiDung ? res.locals.nguoiDung._id : null,
        thongTinNguoiNhan: {
          hoTen: hoTen.trim(),
          soDienThoai: soDienThoai.trim(),
          email: email ? email.trim() : "",
          diaChi: diaChi.trim(),
          ghiChu: ghiChu ? ghiChu.trim() : "",
        },
        danhSachMon: danhSachMonChuanHoa,
        phiVanChuyen: 15000,
        maGiamGia: maGiamGiaChuan,
        tienGiamGia,
        phuongThucThanhToan: phuongThucThanhToan || "tien-mat",
      });

      // Xác định đường dẫn chuyển hướng tiếp theo
      let redirectUrl = `/thanh-toan/thanh-cong?maDonHang=${donHangMoi.maDonHang}`;
      if (phuongThucThanhToan === "payos") {
        redirectUrl = `/thanh-toan/vietqr?maDonHang=${donHangMoi.maDonHang}`;
      }

      return res.json({
        thanhCong: true,
        maDonHang: donHangMoi.maDonHang,
        phuongThucThanhToan: donHangMoi.phuongThucThanhToan,
        redirectUrl,
      });
    } catch (error) {
      console.error("[LỖI ĐẶT HÀNG]:", error);
      return res.status(500).json({
        thanhCong: false,
        thongBao: error.message || "Đặt hàng thất bại, vui lòng thử lại!",
      });
    }
  }

  /**
   * Cổng thanh toán VietQR Napas247
   * GET /thanh-toan/vietqr?maDonHang=...
   */
  async renderVietQR(req, res) {
    try {
      const { maDonHang } = req.query;
      const donHang = await DonHang.findOne({ maDonHang }).lean();
      if (!donHang) {
        return res.redirect("/");
      }
      if (donHang.trangThaiThanhToan === "da-thanh-toan") {
        return res.redirect(`/thanh-toan/thanh-cong?maDonHang=${donHang.maDonHang}`);
      }

      // Thông tin tài khoản ngân hàng OCB (Dùng Virtual Account SePay)
      const bankId = process.env.BANK_NAME || "OCB";
      const accountNo = process.env.BANK_ACCOUNT || "SEPCHIPCHIP";
      const accountName = process.env.BANK_ACCOUNT_NAME || "NGUYEN NHUT TAN";
      const noiDung = `CHIPCHIP ${donHang.maDonHang}`;

      // Tạo link mã QR động chuẩn VietQR
      const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${donHang.tongThanhToan}&addInfo=${encodeURIComponent(noiDung)}&accountName=${encodeURIComponent(accountName)}`;

      res.render("pages/thanh-toan/vietqr", {
        title: "Cổng thanh toán VietQR - ChipChip",
        donHang,
        bankId,
        accountNo,
        accountName,
        noiDung,
        qrUrl,
      });
    } catch (error) {
      console.error("[LỖI RENDER VIETQR]:", error);
      res.redirect("/");
    }
  }

  /**
   * Xác nhận thanh toán thành công
   * POST /thanh-toan/xac-nhan
   */
  async xacNhanThanhToan(req, res) {
    try {
      const { maDonHang } = req.body;
      const donHang = await DonHang.findOneAndUpdate(
        { maDonHang },
        {
          trangThaiThanhToan: "da-thanh-toan",
          trangThaiDonHang: "da-xac-nhan",
        },
        { returnDocument: "after" }
      );

      if (!donHang) {
        return res.status(404).json({ thanhCong: false, thongBao: "Không tìm thấy đơn hàng" });
      }

      return res.json({ thanhCong: true, maDonHang: donHang.maDonHang });
    } catch (error) {
      console.error("[LỖI XÁC NHẬN THANH TOÁN]:", error);
      res.status(500).json({ thanhCong: false, thongBao: error.message });
    }
  }

  /**
   * Trang thông báo đặt hàng thành công
   * GET /thanh-toan/thanh-cong
   */
  async renderThanhCong(req, res) {
    try {
      const { maDonHang } = req.query;
      res.render("pages/thanh-toan/thanh-cong", {
        title: "Đặt hàng thành công",
        maDonHang: maDonHang || "CHIPCHIP",
      });
    } catch (error) {
      console.error("[LỖI TRANG THÀNH CÔNG]:", error);
      res.redirect("/");
    }
  }
    /**
   * API kiểm tra giao dịch tự động từ SePay (Polling)
   * GET /thanh-toan/kiem-tra/:maDonHang
   */
  async kiemTraThanhToan(req, res) {
    try {
      const { maDonHang } = req.params;

      // 1. Tìm đơn hàng trong database
      const donHang = await DonHang.findOne({ maDonHang });
      if (!donHang) {
        return res.status(404).json({ daThanhToan: false, thongBao: "Không tìm thấy đơn hàng" });
      }

      // Nếu đơn đã được xác nhận thanh toán rồi thì trả về true luôn
      if (donHang.trangThaiThanhToan === "da-thanh-toan") {
        return res.json({ daThanhToan: true, maDonHang: donHang.maDonHang });
      }

      // 2. Gọi SePay API lấy danh sách giao dịch gần nhất
      const apiKey = process.env.SEPAY_API_KEY;
      if (!apiKey) {
        return res.json({ daThanhToan: false, thongBao: "Chưa cấu hình SePay API Key" });
      }

      const response = await fetch("https://my.sepay.vn/userapi/transactions/list?limit=20", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const transactions = data.transactions || [];

      // 3. Kiểm tra xem có giao dịch nào khớp mã đơn hàng và đủ tiền không
      const khopGiaoDich = transactions.find((gd) => {
        // Loại bỏ mọi ký tự đặc biệt (dấu gạch ngang, khoảng trắng...) trước khi so sánh
        const noiDungCK = (gd.transaction_content || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
        const soTienVao = parseFloat(gd.amount_in || 0);

        const cleanMaDon = maDonHang.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const dungMaDon = noiDungCK.includes(cleanMaDon);
        const duTien = soTienVao >= donHang.tongThanhToan;

        return dungMaDon && duTien;
      });

      if (khopGiaoDich) {
        // Cập nhật trạng thái đơn hàng sang đã thanh toán
        donHang.trangThaiThanhToan = "da-thanh-toan";
        donHang.trangThaiDonHang = "da-xac-nhan";
        await donHang.save();

        console.log(`[SEPAY THÀNH CÔNG]: Đơn hàng ${maDonHang} đã được thanh toán ${khopGiaoDich.amount_in}đ`);
        return res.json({ daThanhToan: true, maDonHang: donHang.maDonHang });
      }

      return res.json({ daThanhToan: false });
    } catch (error) {
      console.error("[LỖI KIỂM TRA SEPAY]:", error);
      return res.status(500).json({ daThanhToan: false, error: error.message });
    }
  }
    /**
   * API Kiểm tra & Áp dụng mã giảm giá
   * POST /thanh-toan/ap-dung-ma
   */
  async kiemTraMaGiamGia(req, res) {
    try {
      const { maCode, tongTienMon } = req.body;
      if (!maCode) {
        return res.status(400).json({ hopLe: false, thongBao: "Vui lòng nhập mã giảm giá!" });
      }

      const voucher = await KhuyenMai.findOne({
        maCode: maCode.trim().toUpperCase(),
        trangThai: "hoat-dong",
      });

      if (!voucher) {
        return res.status(404).json({ hopLe: false, thongBao: "Mã giảm giá không tồn tại hoặc đã hết hạn!" });
      }

      // Kiểm tra hạn sử dụng
      const homNay = new Date();
      if (voucher.ngayKetThuc && new Date(voucher.ngayKetThuc) < homNay) {
        return res.status(400).json({ hopLe: false, thongBao: "Mã giảm giá này đã hết hạn sử dụng!" });
      }

      // Kiểm tra đơn hàng tối thiểu
      const tongTien = Number(tongTienMon) || 0;
      if (voucher.donHangToiThieu > 0 && tongTien < voucher.donHangToiThieu) {
        return res.status(400).json({
          hopLe: false,
          thongBao: `Đơn hàng tối thiểu phải từ ${voucher.donHangToiThieu.toLocaleString("vi-VN")}đ để dùng mã này!`,
        });
      }

      // Tính số tiền giảm
      let tienGiam = 0;
      if (voucher.loaiGiamGia === "phan-tram") {
        tienGiam = Math.round((tongTien * voucher.giaTriGiam) / 100);
        if (voucher.giamToiDa > 0 && tienGiam > voucher.giamToiDa) {
          tienGiam = voucher.giamToiDa;
        }
      } else {
        tienGiam = voucher.giaTriGiam;
      }

      return res.json({
        hopLe: true,
        maCode: voucher.maCode,
        tienGiam,
        thongBao: `Áp dụng thành công! Bạn được giảm ${tienGiam.toLocaleString("vi-VN")}đ`,
      });
    } catch (error) {
      console.error("[LỖI ÁP DỤNG MÃ]:", error);
      return res.status(500).json({ hopLe: false, thongBao: error.message });
    }
  }
}

module.exports = new ThanhToanController();