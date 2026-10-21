---
name: garan
description: >-
  Hướng dẫn toàn diện về kiến trúc, tiêu chuẩn code và quy trình phát triển dự án Website Bán Gà Rán ChipChip (Express.js 5, MongoDB Mongoose, Pug SSR, Admin BATHBOOM, RESTful API).
  Kích hoạt khi cần: tạo chức năng mới, viết Controller/Service/Model, mở rộng API RESTful, xây dựng giao diện Pug, xử lý xác thực/phân quyền, hoặc debug toàn bộ luồng hệ thống.
---

# ChipChip Chicken – Fullstack Development Skill (/garan)

Cẩm nang kiến trúc và tiêu chuẩn kỹ thuật chuẩn mực cho dự án **Website Bán Gà Rán ChipChip**. 
Toàn bộ mã nguồn tuân thủ triệt để nguyên tắc **DRY (Don't Repeat Yourself)**, **Clean Architecture 6 tầng**, **không hardcode**, tách file mô-đun hóa hiện đại và đồng bộ 100% với cơ sở dữ liệu MongoDB Atlas.

---

## 1. Công nghệ & Nguyên tắc Cốt lõi

| Thành phần | Công nghệ / Tiêu chuẩn | Ghi chú kiến trúc |
|---|---|---|
| **Runtime & Core** | Node.js (v20+), Express.js 5.x | Express 5 native promise handling, async error catching |
| **Cơ sở dữ liệu** | MongoDB Atlas, Mongoose 9.x | Strict schema, virtuals, pre-hooks, populate reference |
| **Giao diện SSR** | Pug Template Engine (Pug 3.x) | Kế thừa layout, block, include partials, component-based |
| **Phong cách UI Admin** | Chuẩn **BATHBOOM** Design | Sage `#8E9F8E`, Blush `#C98F91`, Cream `#F8F6F2`, Viền 2px |
| **Xác thực (Auth)** | JWT (`maXacThuc`), Cookie + Bearer | Hỗ trợ kép cả Cookie session và `Authorization: Bearer <token>` |
| **Bảo mật mật khẩu** | `bcryptjs` (salt rounds 10) | Tự động băm khi tạo mới hoặc cập nhật mật khẩu người dùng |
| **Tương tác Client-side**| AJAX Fetch RESTful, SweetAlert2 | Modal 1 màn hình, Công tắc 3D PATCH, Lọc tự động Realtime |

### 6 Nguyên tắc Bắt buộc:
1. **Ưu Tiên Tiếng Việt Toàn Diện (Vietnamese-First Convention)**:
   - Tên file, tên hàm, tên biến, trường Database, route URL, comment và thông báo hệ thống **100% ưu tiên Tiếng Việt** (không dấu cho code / có dấu cho chuỗi thông báo và giao diện).
   - Tuyệt đối không lai tạp Anh - Việt lộn xộn trong cùng một chức năng.
2. **Không Hardcode**: Toàn bộ chuỗi kết nối DB, Secret Key, Cổng Port đều đọc từ biến môi trường `process.env`.
3. **Kiến trúc 6 Tầng Độc lập**: `Route` $\to$ `Validation Middleware` $\to$ `Controller` $\to$ `Service` $\to$ `Model` $\to$ `Response/View`.
4. **Thin Controller - Fat Service**: Controller chỉ nhận request, gọi Service và trả kết quả. Mọi logic nghiệp vụ, tính toán, truy vấn DB bắt buộc nằm ở `Service`.
5. **RESTful Chuẩn Quốc tế**: Đúng HTTP Verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), đúng HTTP Status Code (`200`, `201`, `400`, `401`, `403`, `404`, `500`), cấu trúc JSON JSend đồng nhất.
6. **Trải nghiệm 1 Màn hình (Single-screen CRUD)**: Trang Admin quản trị không chuyển trang rời rạc; ưu tiên Popup Modal và cập nhật DOM không reload.

---

## 2. Quy Chuẩn Đặt Tên Tiếng Việt (Vietnamese Naming Convention)

Dự án áp dụng triệt để quy ước đặt tên Tiếng Việt để mã nguồn trong sáng, đồng nhất và đúng bản sắc thuần Việt của đồ án:

| Hạng mục | Quy tắc cú pháp | Ví dụ chuẩn trong dự án | Ghi chú |
|---|---|---|---|
| **Tên file chức năng** | `kebab-case` (thường, gạch ngang) | `san-pham.model.js`, `danh-muc.service.js`, `don-hang.controller.js`, `kiem-tra-admin.middleware.js` | Dễ đọc, đồng bộ URL |
| **Tên Model / Class** | `PascalCase` tiếng Việt | `DanhMuc`, `SanPham`, `DonHang`, `KhuyenMai`, `NguoiDung` | Đại diện thực thể |
| **Tên Hàm / Method** | `camelCase` (động từ đứng đầu) | `layDanhSach()`, `layTheoId()`, `taoMoi()`, `capNhat()`, `doiTrangThai()`, `xoa()`, `layTongQuan()` | Rõ hành động nghiệp vụ |
| **Tên Biến & Tham số** | `camelCase` danh từ tiếng Việt | `tenSanPham`, `giaGoc`, `giaKhuyenMai`, `soLuongTon`, `daBan`, `maDanhMuc`, `thongTinNguoiNhan` | Trực quan, dễ hiểu |
| **Trường Database (Schema)**| `camelCase` tiếng Việt | `maDonHang`, `tongThanhToan`, `phuongThucThanhToan`, `trangThaiDonHang`, `lyDoHuy`, `ghiChu` | Khớp 100% MongoDB |
| **Đường dẫn URL Route** | `kebab-case` tiếng Việt | `/admin/san-pham`, `/admin/danh-muc`, `/admin/don-hang`, `/admin/api/san-pham/them-moi` | Thân thiện người dùng Việt |
| **Giao diện & Thông báo** | Tiếng Việt có dấu, chuẩn mực | `"Thêm món ăn mới thành công!"`, `"Giá gốc không được để trống!"`, `"Vui lòng nhập số điện thoại"` | Lịch sự, rõ ràng |
| **Comments / Ghi chú** | Tiếng Việt có dấu đầy đủ | `// Tính tổng thanh toán sau khi trừ khuyến mãi`, `// Kiểm tra ràng buộc khóa ngoại` | Dễ bảo trì, bàn giao |

---

## 3. Cấu trúc Thư mục Dự án (Modular MVC)

```
Du_an_ga_ran_ChipChip/
├── .agents/
│   └── skills/
│       └── garan/
│           └── SKILL.md            ← File Skill này
├── src/
│   ├── app.js                      ← Khởi tạo Express, view engine Pug, middleware toàn cục
│   ├── config/
│   │   └── database.js             ← Kết nối MongoDB Atlas (DNS Google 8.8.8.8, biến môi trường)
│   ├── controllers/
│   │   ├── admin/
│   │   │   ├── api.controller.js   ← Controller tập trung cho toàn bộ RESTful API Admin
│   │   │   ├── san-pham.controller.js
│   │   │   ├── danh-muc.controller.js
│   │   │   ├── don-hang.controller.js
│   │   │   ├── khuyen-mai.controller.js
│   │   │   ├── nguoi-dung.controller.js
│   │   │   └── tong-quan.controller.js
│   │   ├── auth.controller.js      ← Đăng ký, đăng nhập, quên mật khẩu, OTP
│   │   ├── tai-khoan.controller.js ← Thông tin cá nhân, lịch sử mua hàng
│   │   └── trang-chu.controller.js ← Trang chủ bán hàng website
│   ├── middlewares/
│   │   ├── kiem-tra-admin.middleware.js     ← Bảo vệ quyền: yeuCauAdmin, chiAdmin
│   │   ├── kiem-tra-dang-nhap.middleware.js  ← ganThongTinNguoiDung (Cookie & Bearer), yeuCauDangNhap
│   │   ├── khong-tim-thay.middleware.js     ← Xử lý 404 tập trung
│   │   └── xu-li-loi.middleware.js          ← Global Error Handler tập trung
│   ├── models/
│   │   ├── danh-muc.model.js       ← Danh mục món ăn (slug, thuTu, trangThai)
│   │   ├── san-pham.model.js       ← Món gà rán (slug, giaGoc, giaKhuyenMai, daBan, tonKho)
│   │   ├── don-hang.model.js       ← Đơn hàng (maDonHang, thongTinNguoiNhan, danhSachMon, trangThai)
│   │   ├── khuyen-mai.model.js     ← Voucher (maCode, loaiGiamGia, giaTriGiam, ngayBatDau, ngayKetThuc)
│   │   ├── nguoi-dung.model.js     ← Tài khoản (email, password băm bcrypt, vaiTro, trangThai)
│   │   └── OTP.model.js            ← Mã OTP xác thực email (tự hủy sau 5 phút)
│   ├── public/
│   │   ├── css/admin/admin.css     ← Toàn bộ hệ thống style chuẩn BATHBOOM (2000+ dòng)
│   │   ├── js/admin/admin.js       ← RESTful client (adminApi), Modal controller, Realtime filter
│   │   └── images/                 ← Ảnh giao diện, banner, món ăn
│   ├── routes/
│   │   ├── admin/
│   │   │   ├── index.route.js      ← Tổng hợp route Admin (gắn middleware yeuCauAdmin)
│   │   │   ├── api.route.js        ← Router RESTful API (/admin/api, /api/v1/admin)
│   │   │   ├── san-pham.route.js
│   │   │   ├── danh-muc.route.js
│   │   │   ├── don-hang.route.js
│   │   │   ├── khuyen-mai.route.js
│   │   │   ├── nguoi-dung.route.js
│   │   │   └── tong-quan.route.js
│   │   ├── tai-khoan.route.js
│   │   └── xac-thuc.route.js
│   ├── scripts/
│   │   └── khoi-tao-du-lieu.js     ← Script Seeder nạp dữ liệu mẫu ban đầu
│   ├── services/
│   │   ├── san-pham.service.js     ← Xử lý nghiệp vụ món ăn (phân trang, lọc, slug tự động)
│   │   ├── danh-muc.service.js     ← Xử lý danh mục (đếm số món, chặn xóa khi có món)
│   │   ├── don-hang.service.js     ← Xử lý đặt hàng, đổi trạng thái, thanh toán, xóa đơn
│   │   ├── khuyen-mai.service.js   ← Xử lý mã voucher, kiểm tra hiệu lực
│   │   ├── nguoi-dung.service.js   ← Xử lý tài khoản, phân quyền, đổi mật khẩu băm bcrypt
│   │   ├── thong-ke.service.js     ← Tổng hợp số liệu KPI, biểu đồ doanh thu 7 ngày, cơ cấu đơn
│   │   └── email.service.js        ← Gửi email thông báo, mã OTP qua Nodemailer
│   ├── utils/
│   │   ├── dinh-dang.util.js       ← Hàm format tiền tệ VNĐ, ngày tháng, tự động tạo slug tiếng Việt
│   │   └── phan-hoi.util.js        ← Helper chuẩn hóa JSON JSend/JSON:API (thanhCong, loi, phanTrang)
│   ├── validations/
│   │   ├── san-pham.validate.js    ← Middleware kiểm tra dữ liệu đầu vào món ăn
│   │   ├── danh-muc.validate.js    ← Middleware kiểm tra danh mục
│   │   ├── don-hang.validate.js    ← Middleware kiểm tra trạng thái đơn hàng
│   │   ├── khuyen-mai.validate.js  ← Middleware kiểm tra voucher khuyến mãi
│   │   └── nguoi-dung.validate.js  ← Middleware kiểm tra thông tin tài khoản
│   └── views/
│       ├── admin/
│       │   ├── layouts/admin.pug   ← Layout gốc Admin (Sidebar + Topbar + Container + Scripts)
│       │   ├── partials/           ← sidebar.pug, topbar.pug
│       │   └── pages/              ← Các trang: tong-quan, san-pham, danh-muc, don-hang, khuyen-mai, nguoi-dung
│       └── pages/                  ← Giao diện khách hàng: trang-chu, auth, gioi-thieu, tai-khoan
├── server.js                       ← Điểm khởi chạy hệ thống (Listen HTTP Port)
├── package.json
└── .env                            ← Cấu hình môi trường (PORT, MONGODB_URI, JWT_SECRET...)
```

---

## 4. Chi tiết Cơ sở dữ liệu (Database Schemas)

Tất cả các Model đều kích hoạt `timestamps: true` (tự động có `createdAt`, `updatedAt`).

### 4.1. Danh mục (`DanhMuc`) – [src/models/danh-muc.model.js](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/models/danh-muc.model.js)
* `tenDanhMuc`: String, required, unique, trim.
* `slug`: String, required, unique, lowercase, trim (tự động sinh từ `tenDanhMuc` qua hook `pre('validate')`).
* `moTa`: String, default `""`.
* `bieuTuong`: String, default `"restaurant_menu"`.
* `hinhAnh`: String, default `""`.
* `thuTu`: Number, default `0`.
* `trangThai`: String, enum: `["hien-thi", "an"]`, default `"hien-thi"`.
* **Ràng buộc nghiệp vụ**: Trước khi xóa Danh mục, Service bắt buộc kiểm tra xem có Món ăn nào đang trỏ `maDanhMuc` về nó không; nếu có thì từ chối xóa để bảo toàn dữ liệu.

### 4.2. Món ăn / Sản phẩm (`SanPham`) – [src/models/san-pham.model.js](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/models/san-pham.model.js)
* `tenSanPham`: String, required, trim.
* `slug`: String, required, unique, lowercase (tự động sinh chuẩn SEO, kiểm tra chống trùng lặp hậu tố `-1234`).
* `maDanhMuc`: ObjectId ref `"DanhMuc"`, required.
* `giaGoc`: Number, required, min `0`.
* `giaKhuyenMai`: Number, default `0`, min `0`.
* `khauPhan`: String, default `"1 phần"`.
* `tenTiengAnh`: String, default `""`.
* `moTa`: String, default `""`.
* `hinhAnh`: String, default `"/images/trang-chu/thuc-don-01.jpg"`.
* `huyHieu`: String, default `""` (Ví dụ: "Bán chạy nhất", "Siêu giòn", "Hot").
* `loaiHuyHieu`: String, default `"secondary"`.
* `noiBat`: Boolean, default `false`.
* `banChay`: Boolean, default `false`.
* `soLuongTon`: Number, default `100`, min `0`.
* `daBan`: Number, default `0`.
* `trangThai`: String, enum: `["dang-ban", "het-hang", "ngung-ban"]`, default `"dang-ban"`.
* **Virtual field**: `giaHienTai` (tự động lấy `giaKhuyenMai` nếu có và nhỏ hơn `giaGoc`).

### 4.3. Đơn hàng (`DonHang`) – [src/models/don-hang.model.js](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/models/don-hang.model.js)
* `maDonHang`: String, required, unique (Ví dụ: `CC-261021-9988`).
* `maNguoiDung`: ObjectId ref `"NguoiDung"`, default `null` (hỗ trợ cả khách vãng lai và thành viên).
* `thongTinNguoiNhan`: Object gồm:
  - `hoTen`: String, required.
  - `soDienThoai`: String, required.
  - `email`: String, default `""`.
  - `diaChi`: String, required.
  - `ghiChu`: String, default `""` (lời dặn từ khách khi đặt món).
* `danhSachMon`: Array các món:
  - `maSanPham`: ObjectId ref `"SanPham"`, required.
  - `tenSanPham`: String, required.
  - `hinhAnh`: String, default `""`.
  - `gia`: Number, required.
  - `soLuong`: Number, required, min `1`.
  - `thanhTien`: Number, required.
* `tongTienMon`: Number, required, min `0`.
* `phiVanChuyen`: Number, default `15000`.
* `maGiamGia`: String, default `""`.
* `tienGiamGia`: Number, default `0`.
* `tongThanhToan`: Number, required, min `0` (`tongTienMon + phiVanChuyen - tienGiamGia`).
* `phuongThucThanhToan`: String, enum: `["tien-mat", "chuyen-khoan", "momo", "vnpay"]`, default `"tien-mat"`.
* `trangThaiThanhToan`: String, enum: `["chua-thanh-toan", "da-thanh-toan"]`, default `"chua-thanh-toan"`.
* `trangThaiDonHang`: String, enum:
  - `"cho-xac-nhan"`: Đơn hàng mới đặt chờ duyệt
  - `"da-xac-nhan"`: Cửa hàng đã tiếp nhận
  - `"dang-che-bien"`: Bếp đang chiên gà
  - `"dang-giao"`: Shipper đang trên đường giao
  - `"da-giao"`: Đã giao thành công (nếu tiền mặt, tự động cập nhật thanh toán)
  - `"da-huy"`: Đơn hàng đã bị hủy
* `lyDoHuy`: String, default `""`.
* `ghiChu`: String, default `""` (ghi chú nội bộ của nhân viên/quản trị viên).

### 4.4. Khuyến mãi / Voucher (`KhuyenMai`) – [src/models/khuyen-mai.model.js](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/models/khuyen-mai.model.js)
* `maCode`: String, required, unique, uppercase, trim (Ví dụ: `CHIPCHIPHE`, `FREESHIP`).
* `tieuDe`: String, required.
* `moTa`: String, default `""`.
* `loaiGiamGia`: String, enum: `["phan-tram", "tien-mat"]`, default `"phan-tram"`.
* `giaTriGiam`: Number, required, min `1`.
* `giamToiDa`: Number, default `0`.
* `donHangToiThieu`: Number, default `0`.
* `soLuong`: Number, default `100`.
* `daSuDung`: Number, default `0`.
* `ngayBatDau`: Date, default `Date.now`.
* `ngayKetThuc`: Date.
* `trangThai`: String, enum: `["hoat-dong", "tam-dung", "het-han"]`, default `"hoat-dong"`.

### 4.5. Người dùng (`NguoiDung`) – [src/models/nguoi-dung.model.js](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/models/nguoi-dung.model.js)
* `hoTen`: String, required, trim.
* `email`: String, required, unique, lowercase, trim.
* `password`: String, required (được băm bcrypt trước khi lưu).
* `SDT`: String, default `""`.
* `diaChi`: String, default `""`.
* `ghiChuGiaoHang`: String, default `""`.
* `vaiTro`: String, enum: `["khach-hang", "nhan-vien", "admin"]`, default `"khach-hang"`.
* `trangThai`: String, enum: `["hoat-dong", "khoa"]`, default `"hoat-dong"`.
* `anhDaiDien`: String, default `""`.
* **Methods**: `kiemTraMatKhau(matKhauNhap)` dùng `bcrypt.compare`.

---

## 5. Chuẩn RESTful API Quốc tế

Hệ thống định tuyến API qua 2 router chính:
* `/admin/api/...` (gắn trong router admin)
* `/api/v1/admin/...` và `/api/admin/...` (gắn tại app gốc với middleware `yeuCauAdmin`)

### 5.1. Bảng Định tuyến Chuẩn:
| Tài nguyên | Method | URL Endpoint | Chức năng | Body / Query chính |
|---|---|---|---|---|
| **Món ăn** | `GET` | `/admin/api/san-pham` | Lấy danh sách phân trang | `?tuKhoa=&maDanhMuc=&trangThai=&trang=&gioiHan=` |
| | `GET` | `/admin/api/san-pham/:id` | Xem chi tiết 1 món ăn | Param `id` |
| | `POST` | `/admin/api/san-pham` | Tạo món ăn mới | `tenSanPham`, `maDanhMuc`, `giaGoc`, `khauPhan`... |
| | `PUT` | `/admin/api/san-pham/:id` | Cập nhật toàn diện món | Dữ liệu cập nhật đầy đủ |
| | `PATCH` | `/admin/api/san-pham/:id/trang-thai` | Đổi trạng thái nhanh | `{ "trangThai": "dang-ban" / "ngung-ban" }` |
| | `DELETE` | `/admin/api/san-pham/:id` | Xóa món ăn | Param `id` |
| **Danh mục** | `GET` | `/admin/api/danh-muc` | Lấy tất cả danh mục kèm số món | - |
| | `GET` | `/admin/api/danh-muc/:id` | Chi tiết danh mục | Param `id` |
| | `POST` | `/admin/api/danh-muc` | Tạo danh mục mới | `tenDanhMuc`, `thuTu`, `moTa` |
| | `PUT` | `/admin/api/danh-muc/:id` | Sửa danh mục | `tenDanhMuc`, `thuTu`, `moTa` |
| | `PATCH` | `/admin/api/danh-muc/:id/trang-thai` | Đổi ẩn/hiện nhanh | `{ "trangThai": "hien-thi" / "an" }` |
| | `DELETE` | `/admin/api/danh-muc/:id` | Xóa danh mục | Param `id` (chặn nếu còn món) |
| **Voucher** | `GET` | `/admin/api/khuyen-mai` | Danh sách voucher | - |
| | `GET` | `/admin/api/khuyen-mai/:id` | Chi tiết voucher | Param `id` |
| | `POST` | `/admin/api/khuyen-mai` | Tạo mã mới | `maCode`, `tieuDe`, `giaTriGiam`... |
| | `PUT` | `/admin/api/khuyen-mai/:id` | Cập nhật mã | Thông tin cập nhật |
| | `PATCH` | `/admin/api/khuyen-mai/:id/trang-thai` | Bật/tắt hiệu lực mã | `{ "trangThai": "hoat-dong" / "tam-dung" }` |
| | `DELETE` | `/admin/api/khuyen-mai/:id` | Xóa voucher | Param `id` |
| **Người dùng** | `GET` | `/admin/api/nguoi-dung` | Lọc danh sách tài khoản | `?tuKhoa=&vaiTro=&trangThai=&trang=&gioiHan=` |
| | `GET` | `/admin/api/nguoi-dung/:id` | Xem thông tin tài khoản | Param `id` |
| | `POST` | `/admin/api/nguoi-dung` | Tạo tài khoản mới | `hoTen`, `email`, `password`, `vaiTro` |
| | `PUT` | `/admin/api/nguoi-dung/:id` | Sửa quyền & đổi pass | `hoTen`, `vaiTro`, `trangThai`, `matKhauMoi` |
| | `PATCH` | `/admin/api/nguoi-dung/:id/trang-thai` | Khóa/Mở khóa nhanh | `{ "trangThai": "hoat-dong" / "khoa" }` |
| | `DELETE` | `/admin/api/nguoi-dung/:id` | Xóa tài khoản | Param `id` (trừ Super Admin) |
| **Đơn hàng** | `GET` | `/admin/api/don-hang` | Lấy danh sách đơn hàng | `?tuKhoa=&trangThaiDonHang=&trangThaiThanhToan=` |
| | `GET` | `/admin/api/don-hang/:id` | Chi tiết hóa đơn | Param `id` |
| | `PATCH` | `/admin/api/don-hang/:id/trang-thai` | Cập nhật tiến trình đơn | `{ "trangThaiDonHang", "trangThaiThanhToan", "lyDoHuy", "ghiChu" }` |
| | `DELETE` | `/admin/api/don-hang/:id` | Xóa đơn hàng hủy/test | Param `id` |
| **Tổng quan** | `GET` | `/admin/api/tong-quan` | Lấy số liệu thống kê Dashboard | - |

### 5.2. Cấu trúc JSON Chuẩn (Helper `phan-hoi.util.js`):
* **Phản hồi thành công (200 / 201)**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Lấy danh sách món ăn thành công",
    "data": [ ... ],
    "meta": {
      "pagination": {
        "totalItems": 25,
        "totalPages": 3,
        "currentPage": 1,
        "pageSize": 10,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```
* **Phản hồi lỗi (400 / 401 / 403 / 404 / 500)**:
  ```json
  {
    "success": false,
    "statusCode": 400,
    "message": "Giá gốc không được để trống!",
    "errors": ["Giá gốc không được để trống!", "Danh mục không hợp lệ!"]
  }
  ```

---

## 6. Tiêu chuẩn Giao diện Admin BATHBOOM & SSR Pug

### 6.1. Bảng màu Nhận diện:
```css
--admin-sidebar-bg: #8E9F8E;      /* Xanh xám Sage đặc trưng */
--admin-sidebar-active: #7A8C7A;  /* Xanh rêu đậm khi hover/active */
--admin-primary: #C98F91;         /* Hồng đất Blush thanh lịch */
--admin-primary-hover: #B87C7E;
--admin-bg: #F8F6F2;              /* Trắng kem Ivory nền dịu mắt */
--admin-card-bg: #FFFFFF;
--admin-text-main: #4A3E3D;       /* Nâu sô-cô-la đậm sang trọng */
--admin-text-muted: #7B6E6D;
--admin-border-thick: 2px solid #B0A298; /* Viền thẻ đậm chất cổ điển */
--admin-table-border: 2px solid #9C8C80;
```

### 6.2. Các Thành phần Tương tác Cốt lõi:
1. **Bộ lọc Realtime Client-side (`window.initRealtimeTableFilter`)**:
   - Tự động bắt sự kiện `input` trên ô tìm kiếm và `change` trên các select lọc.
   - Ẩn/hiện dòng bảng ngay lập tức, cập nhật huy hiệu đếm `Hiển thị X / Y món`.
   - Tự động hiển thị `realtime-empty-row` có icon và lời khuyên khi không có kết quả phù hợp.
2. **Công tắc 3D AJAX PATCH (`window.toggleTrangThaiApi`)**:
   - Gạt công tắc ngay trên dòng bảng gọi trực tiếp `PATCH /admin/api/.../trang-thai`.
   - Vô hiệu hóa nút tạm thời chống spam click; hoàn tác checkbox nếu máy chủ trả lỗi.
   - Thêm/bỏ class `.row-disabled .is-disabled` để làm mờ dòng khi ngưng hoạt động.
3. **Popup Modal 1 Màn hình (`openAdminModal`, `closeAdminModal`, `xuLiSubmitModalRestful`)**:
   - Form Thêm mới và Sửa mở bằng modal nổi trên cùng màn hình.
   - Đóng nhanh bằng phím `Escape` hoặc click ra nền mờ ngoài modal.
   - Gửi request qua `window.adminApi.post/put`, hiển thị nút loading xoay tròn, sau đó toast thông báo SweetAlert2.
4. **Xóa an toàn không tải lại trang (`initDeleteConfirm`)**:
   - Bắt sự kiện submit của form `.form-xac-nhan-xoa`.
   - Mở SweetAlert2 xác nhận với 2 nút màu Blush & Nâu.
   - Gọi `window.adminApi.delete(url)`, sau đó làm mờ và trượt mất hàng vừa xóa (`opacity: 0; transform: translateX(25px)`). Nếu xóa từ trang chi tiết, tự động chuyển trang êm ái về danh sách.

---

## 7. Quy trình 6 Bước Thêm Mới Một Phân hệ Chuẩn

Khi cần bổ sung một tính năng hoặc phân hệ quản lý mới (ví dụ: Quản lý Tin tức / Đánh giá):

1. **Bước 1 – Tạo Model Schema** (`src/models/ten-mo-hinh.model.js`):
   - Khai báo Schema Mongoose với các kiểu dữ liệu, `required`, `trim`, `default`, `timestamps: true`.
   - Nếu có slug: gắn hook `pre('validate')` gọi hàm `taoSlug(this.ten)`.
2. **Bước 2 – Tạo Validation Middleware** (`src/validations/ten-mo-hinh.validate.js`):
   - Tạo các middleware: `idHopLe`, `taoMoi`, `capNhat`, `doiTrangThai`.
   - Dùng helper `traVeLoiValidate(req, res, errors)` để tự động phát hiện API trả JSON (400) hoặc Form SSR redirect kèm query `?loi=...`.
3. **Bước 3 – Tạo Service Nghiệp vụ** (`src/services/ten-mo-hinh.service.js`):
   - Class chứa: `layDanhSach({ tuKhoa, trang, gioiHan })`, `layTheoId(id)`, `taoMoi(duLieu)`, `capNhat(id, duLieu)`, `doiTrangThai(id, trangThai)`, `xoa(id)`.
   - Mọi truy vấn DB `Model.find`, `countDocuments`, `findByIdAndUpdate` đều nằm ở đây.
4. **Bước 4 – Tạo Controller** (`src/controllers/admin/ten-mo-hinh.controller.js` & `api.controller.js`):
   - Controller SSR: render file Pug tương ứng (`index`, `them-moi`, `chinh-sua`).
   - Controller API: gọi service và bọc kết quả qua `phanHoiThanhCong(res, 200, ...)` hoặc `phanHoiLoi(res, ...)`.
5. **Bước 5 – Đăng ký Router** (`src/routes/admin/ten-mo-hinh.route.js` & `api.route.js`):
   - Route SSR: `GET /`, `POST /them-moi`, `POST /chinh-sua/:id`, `POST /xoa/:id`, `POST /doi-trang-thai/:id`.
   - Route RESTful API: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `PATCH /:id/trang-thai`, `DELETE /:id`.
   - Đăng ký vào [`src/routes/admin/index.route.js`](file:///e:/Desktop/trikun/WEB_PMC/Du_an_ga_ran_ChipChip/src/routes/admin/index.route.js).
6. **Bước 6 – Viết Giao diện Pug** (`src/views/admin/pages/ten-mo-hinh/index.pug`):
   - `extends ../../layouts/admin`.
   - Gắn tiêu đề topbar, thanh thống kê pills.
   - Thêm khung bộ lọc realtime `.filter-card-compact`.
   - Bảng dữ liệu viền đậm `.table-custom` kèm công tắc switch 3D và nút mini `.btn-mini-action`.
   - Popup Modal thêm mới & sửa trực tiếp, kết nối hàm `initRealtimeTableFilter` trong `block scripts`.

---

## 8. Lệnh Thực thi & Kiểm tra Hệ thống

* **Chạy server phát triển (tự động reload)**:
  ```powershell
  npm start
  ```
* **Chạy server chế độ thường**:
  ```powershell
  node server.js
  ```
* **Khởi tạo / Nạp lại toàn bộ dữ liệu mẫu (Seeder)**:
  ```powershell
  npm run seed
  ```
* **Kiểm tra cú pháp toàn bộ file JavaScript**:
  ```powershell
  Get-ChildItem -Recurse -Filter "*.js" src | ForEach-Object { node -c $_.FullName }
  ```
* **Kiểm tra biên dịch toàn bộ template Pug**:
  ```powershell
  node -e "const fs = require('fs'); const path = require('path'); const pug = require('pug'); function check(dir) { fs.readdirSync(dir, { withFileTypes: true }).forEach(e => { const f = path.join(dir, e.name); if (e.isDirectory()) check(f); else if (e.name.endsWith('.pug')) pug.compileFile(f); }); } check('src/views'); console.log('All Pug templates valid!');"
  ```
