# Dự án gà rán ChipChip

Website bán gà rán online được xây dựng bằng **Node.js + Express.js + MongoDB + Pug**.

Dự án này render giao diện trực tiếp từ server bằng **Pug**, nên không tách frontend riêng. Tất cả code nằm chung trong một project Express.

## Công nghệ sử dụng

- **Node.js**: môi trường chạy JavaScript phía server
- **Express.js**: framework tạo server và xử lý route
- **MongoDB**: cơ sở dữ liệu NoSQL
- **Mongoose**: thư viện làm việc với MongoDB dễ hơn
- **Pug**: template engine để render HTML từ server
- **bcryptjs**: mã hóa mật khẩu người dùng
- **jsonwebtoken (JWT)** + **cookie-parser**: đăng nhập, lưu token trong cookie
- **Nodemailer**: gửi email mã OTP khi đăng ký
- **dotenv**: đọc biến môi trường từ file `.env`
- **Nodemon**: tự động restart server khi code thay đổi (chỉ dùng khi dev)

## Yêu cầu môi trường

- **Node.js >= 20.19** (Mongoose 9 yêu cầu tối thiểu bản này). Khuyên dùng **Node 22** — file `.nvmrc` đã ghi sẵn `22`, nếu dùng `nvm` thì chỉ cần chạy `nvm use`.
- **npm** đi kèm Node.js
- Một database MongoDB (local hoặc Atlas, xem phần [Cấu hình MongoDB](#cấu-hình-mongodb))
- Một tài khoản Gmail có **App Password** nếu muốn gửi được email OTP khi đăng ký

Kiểm tra phiên bản Node đang dùng:

```bash
node -v
```

## Cách chạy dự án

Clone project về máy:

```bash
git clone <link-repository>
cd Du_an_ga_ran_ChipChip
```

Cài thư viện:

```bash
npm install
```

Lệnh `npm install` sẽ đọc file `package.json` và tự cài các thư viện cần thiết:

```txt
express
mongoose
pug
dotenv
bcryptjs
cookie-parser
jsonwebtoken
nodemailer
nodemon (devDependencies)
```

Nếu tạo project từ đầu và muốn cài thủ công thì dùng:

```bash
npm install express mongoose pug dotenv bcryptjs cookie-parser jsonwebtoken nodemailer
npm install --save-dev nodemon
```

Tạo file `.env` bằng cách copy từ mẫu `.env.example`:

```bash
cp .env.example .env
```

Sau đó mở `.env` và điền giá trị thật, ví dụ:

```env
PORT=3007
MONGODB_URI=mongodb://127.0.0.1:27017/ga_ran_chipchip
JWT_SECRET=mot-chuoi-bi-mat-dai-va-kho-doan
EMAIL_USER=tai-khoan-cua-ban@gmail.com
EMAIL_PASS=app-password-16-ky-tu
NODE_ENV=development
```

Ý nghĩa các biến môi trường:

| Biến | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| `PORT` | Không | Cổng chạy website, mặc định `3007` |
| `MONGODB_URI` | **Có** | Link kết nối MongoDB (local hoặc Atlas) |
| `JWT_SECRET` | **Có** | Chuỗi bí mật dùng để ký token đăng nhập (JWT) |
| `EMAIL_USER` | Khi cần gửi OTP | Địa chỉ Gmail dùng để gửi email OTP khi đăng ký |
| `EMAIL_PASS` | Khi cần gửi OTP | **App Password** của Gmail (không phải mật khẩu đăng nhập Gmail) |
| `BREVO_API_KEY` | Chỉ khi deploy | Có biến này thì OTP gửi qua API Brevo thay cho Gmail SMTP (xem mục Deploy). Chạy local để trống |
| `NODE_ENV` | Không | Đặt `production` khi deploy để cookie đăng nhập được bật `secure` (chỉ gửi qua HTTPS) |

Lưu ý: nếu thiếu `MONGODB_URI` hoặc `JWT_SECRET` thì server sẽ **từ chối khởi động** và báo lỗi, nên nhớ điền đủ 2 biến này trước khi chạy.

## Cấu hình MongoDB

Code trong dự án đã có sẵn phần kết nối MongoDB bằng Mongoose:

```txt
src/config/database.js
```

Nhưng để kết nối được thì vẫn cần có database MongoDB thật. Có 2 cách dùng:

### Cách 1: Dùng MongoDB local

Nếu dùng local, máy cần cài:

- **MongoDB Community Server**: database server chạy trên máy
- **MongoDB Compass**: giao diện để xem database, không bắt buộc nhưng nên có

Khi MongoDB local đang chạy, dùng cấu hình:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ga_ran_chipchip
```

Nếu chưa cài MongoDB local mà vẫn dùng link này, server sẽ báo lỗi kết nối, thường gặp:

```txt
ECONNREFUSED 127.0.0.1:27017
```

Lỗi này không phải do code sai, mà do máy chưa có MongoDB server đang chạy.

### Cách 2: Dùng MongoDB Atlas

MongoDB Atlas là database online. Cách này không cần cài MongoDB trên máy, chỉ cần internet và connection string.

Trong `.env`, thay `MONGODB_URI` bằng link Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ga_ran_chipchip
```

Ví dụ minh họa:

```env
MONGODB_URI=mongodb+srv://chipchip_user:matkhaucuaban@cluster0.xxxxx.mongodb.net/ga_ran_chipchip
```

Khi dùng Atlas cần lưu ý:

- Không push file `.env` lên GitHub
- Chỉ push `.env.example` để làm mẫu
- Username, password, cluster URL thật chỉ để trong `.env` trên máy mỗi người
- Trong Atlas cần cho phép IP truy cập database

Tóm lại:

```txt
Mongoose = thư viện Node.js dùng để kết nối MongoDB
MongoDB local hoặc Atlas = database thật
```

Nếu không có MongoDB local hoặc Atlas, server sẽ không kết nối database được.

## Các lệnh npm

Chạy server ở môi trường dev (dùng `nodemon`, tự restart khi sửa code):

```bash
npm run dev
```

Chạy server bình thường (dùng `node server.js`, dùng khi deploy/production):

```bash
npm start
```

Build/kiểm tra code trước khi push (không cần database hay file `.env`):

```bash
npm run build
```

`npm run build` chạy `npm run check`. Dự án là Express + Pug SSR nên không có bước biên dịch, "build" ở đây là kiểm tra toàn bộ code không lỗi.

Sau khi chạy server, mở trình duyệt tại:

```txt
http://localhost:3007
```

Cổng mặc định là `3007` (khai báo trong `server.js`), có thể đổi bằng biến `PORT` trong `.env`.

## Kiểm tra build / CI

Lệnh `npm run check` sẽ chạy file `scripts/check.js` để:

- Kiểm tra cú pháp (syntax) của các file JavaScript
- Thử load `src/app.js` để chắc chắn các `require` không bị lỗi
- Compile toàn bộ view Pug để phát hiện lỗi template

Lệnh này **không cần kết nối MongoDB và không cần file `.env`**, nên ai clone về cũng chạy được ngay sau `npm install`.

Dự án có cấu hình **GitHub Actions** tại `.github/workflows/ci.yml`:

- Tự chạy khi push lên nhánh `main` và khi mở/cập nhật **mọi Pull Request**
- Chạy trên 2 phiên bản Node: `20.19.x` và `22.x`
- Các bước: `npm ci` rồi `npm run build` (giống hệt lệnh chạy ở máy)

### Tự kiểm tra trước khi push (git hook)

Dự án có git hook `.githooks/pre-push`: **mỗi lần `git push`, hook tự chạy `npm run build`, nếu lỗi thì chặn push** và in ra file bị lỗi.

- Hook được bật tự động khi chạy `npm install` hoặc `npm ci` (script `prepare` → `scripts/setup-hooks.js` đặt `git config core.hooksPath .githooks`).
- Ai đã clone từ trước chỉ cần chạy lại `npm install` một lần để bật hook.
- Trường hợp khẩn cấp có thể bỏ qua: `git push --no-verify` (CI trên GitHub vẫn sẽ kiểm tra).

Quy ước làm việc:

- Chạy `npm run build` ở máy trước khi push (hook cũng tự chạy khi push)
- Làm tính năng trên nhánh riêng (ví dụ `feature/ten-tinh-nang`) rồi mở Pull Request
- **Chỉ merge Pull Request khi CI báo xanh** (tất cả check đều pass)

## Deploy lên Render (link web chạy thật)

GitHub Pages chỉ phát file tĩnh nên **không chạy được** dự án Node/Express này (nó chỉ hiện README). Web được deploy lên **Render** (gói Free) theo file cấu hình `render.yaml`, database dùng **MongoDB Atlas**.

Render gói Free **chặn cổng SMTP** (25/465/587) nên không gửi được mail qua Gmail. Vì vậy khi deploy, email OTP được gửi qua **API của Brevo** (HTTPS, miễn phí 300 mail/ngày). Code tự chọn: có `BREVO_API_KEY` thì dùng Brevo, không có thì dùng Gmail.

### Bước 1: MongoDB Atlas cho phép Render kết nối

Atlas → **Network Access** → **Add IP Address** → `0.0.0.0/0` (Allow access from anywhere). Render Free không có IP cố định nên phải mở như vậy; bảo mật vẫn nhờ username/password trong `MONGODB_URI`.

### Bước 2: Lấy API key của Brevo

1. Đăng ký tài khoản tại [brevo.com](https://www.brevo.com) (miễn phí).
2. **Senders, Domains & Dedicated IPs** → **Senders** → thêm email dùng làm `EMAIL_USER` và bấm link xác minh gửi về hộp thư.
3. **SMTP & API** → tab **API Keys** → **Generate a new API key** → copy lại (chỉ hiện 1 lần).

### Bước 3: Tạo web trên Render

1. Đăng nhập [render.com](https://render.com) bằng GitHub. Tài khoản GitHub phải có quyền admin repo (chủ repo hoặc được chủ repo cấp quyền) để Render đọc được repo.
2. **New** → **Blueprint** → chọn repo `Du_an_ga_ran_ChipChip` → Render đọc `render.yaml`.
3. Điền các biến Render hỏi: `MONGODB_URI` (link Atlas), `EMAIL_USER` (email đã xác minh ở Brevo), `BREVO_API_KEY`. `JWT_SECRET` được Render tự sinh.
4. Bấm **Apply** và đợi build xong. Link web có dạng `https://ga-ran-chipchip.onrender.com` (tên có thể khác nếu bị trùng).

Sau đó mỗi lần merge vào `main`, Render **chờ CI trên GitHub báo xanh rồi mới deploy** (`autoDeployTrigger: checksPass` trong `render.yaml`). CI đỏ thì Render không deploy, web vẫn chạy bản cũ.

### Lưu ý gói Free

- Không có người truy cập khoảng 15 phút thì server "ngủ", lần mở đầu tiên phải chờ khoảng 30–60 giây. Trước khi thầy chấm nên mở link trước 1 lần.
- Email OTP gửi từ Gmail qua Brevo có thể rơi vào mục **Spam**, nhớ kiểm tra.

## Cấu trúc thư mục

```txt
Du_an_ga_ran_ChipChip/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions: npm ci + npm run build
├── render.yaml                       # Cấu hình deploy lên Render
├── .githooks/
│   └── pre-push                      # Tự chạy npm run build trước khi push, lỗi thì chặn
├── scripts/
│   ├── check.js                      # Kiểm tra syntax, load app, compile Pug (npm run check/build)
│   └── setup-hooks.js                # Bật git hook khi npm install (script prepare)
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── tai-khoan.controller.js
│   ├── middlewares/
│   │   ├── kiem-tra-dang-ky.middleware.js
│   │   └── kiem-tra-dang-nhap.middleware.js
│   ├── models/
│   │   ├── danh-muc.model.js
│   │   ├── nguoi-dung.model.js
│   │   ├── OTP.model.js
│   │   └── san-pham.model.js
│   ├── public/
│   │   ├── css/
│   │   │   ├── gioi-thieu/
│   │   │   ├── trang-chu/
│   │   │   ├── layout.css
│   │   │   ├── style.css
│   │   │   └── tokens.css
│   │   ├── images/
│   │   │   ├── banner/
│   │   │   ├── gioi-thieu/
│   │   │   ├── products/
│   │   │   └── trang-chu/
│   │   └── js/
│   │       ├── layout.js
│   │       └── trang-chu.js
│   ├── routes/
│   │   ├── san-pham.route.js
│   │   ├── tai-khoan.route.js
│   │   └── xac-thuc.route.js
│   ├── services/
│   │   └── email.service.js
│   ├── utils/
│   ├── views/
│   │   ├── admin/
│   │   ├── layouts/
│   │   │   └── main.pug
│   │   ├── pages/
│   │   │   ├── auth/                 # dang-nhap, dang-ky, xac-nhan-otp
│   │   │   ├── gioi-thieu/
│   │   │   ├── san-pham/             # thuc-don, chi-tiet
│   │   │   ├── tai-khoan/            # thong-tin, doi-mat-khau, don-hang
│   │   │   └── trang-chu/
│   │   └── partials/
│   │       ├── footer.pug
│   │       └── header.pug
│   └── app.js
├── .env.example
├── .gitignore
├── .nvmrc
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

Các file `_huong-dan.txt` trong từng thư mục là ghi chú hướng dẫn, không ảnh hưởng tới code.

## Ý nghĩa từng thư mục

### `src/config`

Chứa các file cấu hình của dự án.

Ví dụ:

- `database.js`: kết nối MongoDB

Biến môi trường được đọc bằng `dotenv` ngay trong `server.js`, không có file cấu hình env riêng.

### `src/models`

Chứa schema MongoDB bằng Mongoose.

Mỗi collection nên có một file model riêng.

Hiện có:

```txt
nguoi-dung.model.js
san-pham.model.js
danh-muc.model.js
OTP.model.js
```

Dự kiến thêm: `don-hang.model.js`.

### `src/routes`

Chứa các đường dẫn của website.

Route chỉ nên khai báo URL và gọi controller, không nên viết logic dài trong route.

Hiện có:

```txt
xac-thuc.route.js    -> /auth (đăng nhập, đăng ký, xác nhận OTP, đăng xuất)
tai-khoan.route.js   -> /tai-khoan (thông tin, đổi mật khẩu, đơn hàng)
san-pham.route.js    -> /thuc-don và /san-pham/:slug
```

Trang chủ `/` và trang giới thiệu `/gioi-thieu` đang khai báo trực tiếp trong `src/app.js`.

Dự kiến thêm: `gio-hang.route.js`, `don-hang.route.js`, `admin.route.js`.

### `src/controllers`

Controller nhận request từ route, gọi service nếu cần, sau đó render view Pug.

Hiện có:

```txt
auth.controller.js
tai-khoan.controller.js
```

Ví dụ render trang danh sách món ăn (view nằm trong thư mục theo module):

```js
res.render("pages/san-pham/thuc-don", {
  title: "Thực đơn - Gà Rán ChipChip",
  sanPhams,
  danhMucs
});
```

### `src/services`

Chứa logic xử lý nghiệp vụ.

Hiện có `email.service.js` dùng Nodemailer để gửi email mã OTP.

Ví dụ các việc nên đưa vào service:

- Gửi email OTP
- Lấy danh sách sản phẩm
- Tính tổng tiền giỏ hàng
- Tạo đơn hàng
- Cập nhật trạng thái đơn hàng

Controller nên gọi service để code gọn hơn.

### `src/middlewares`

Chứa các middleware dùng chung cho Express.

Ví dụ:

- Kiểm tra người dùng đã đăng nhập chưa
- Kiểm tra quyền admin
- Xử lý lỗi 404 hoặc lỗi server

### `src/views`

Chứa toàn bộ file giao diện Pug.

Dự án này dùng server-side rendering, nên HTML sẽ được render từ các file trong thư mục này.

```txt
views/layouts/
```

Chứa layout chung của website, ví dụ `main.pug`.

```txt
views/partials/
```

Chứa các phần giao diện dùng lại nhiều nơi, ví dụ:

- `header.pug`
- `navbar.pug`
- `footer.pug`

```txt
views/pages/<module>/
```

Chứa các trang cho khách hàng, mỗi module một thư mục con. File bắt đầu bằng dấu `_` (ví dụ `_hero.pug`) là các section được `include` vào trang chính của module đó.

```txt
pages/trang-chu/trang-chu.pug       -> Trang chủ
pages/gioi-thieu/gioi-thieu.pug     -> Giới thiệu
pages/san-pham/thuc-don.pug         -> Thực đơn
pages/san-pham/chi-tiet.pug         -> Chi tiết món ăn
pages/auth/dang-nhap.pug            -> Đăng nhập
pages/auth/dang-ky.pug              -> Đăng ký
pages/auth/xac-nhan-otp.pug         -> Xác nhận OTP
pages/tai-khoan/thong-tin.pug       -> Thông tin tài khoản
pages/tai-khoan/doi-mat-khau.pug    -> Đổi mật khẩu
pages/tai-khoan/don-hang.pug        -> Đơn hàng của tôi
```

Dự kiến thêm: Giỏ hàng, Thanh toán.

```txt
views/admin/
```

Chứa các trang quản trị, ví dụ:

- Dashboard
- Quản lý món ăn
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý người dùng

Nếu giai đoạn đầu chưa làm admin thì có thể để trống.

### `src/public`

Chứa file tĩnh được trình duyệt tải trực tiếp.

Ví dụ:

- `css/tokens.css`, `css/layout.css`, `css/style.css`: style dùng chung
- `css/<module>/`: style riêng cho từng trang (ví dụ `css/trang-chu/hero.css`)
- `js/layout.js`, `js/trang-chu.js`: JavaScript phía trình duyệt
- `images/<module>/`: hình ảnh theo từng trang (`trang-chu/`, `gioi-thieu/`, `products/`, `banner/`)

### `src/utils`

Chứa các hàm tiện ích dùng lại nhiều nơi.

Ví dụ:

- Format tiền Việt Nam
- Tạo slug sản phẩm
- Format ngày tháng

## Design pattern sử dụng

Dự án đi theo mô hình **MVC**.

MVC gồm 3 phần chính:

- **Model**: làm việc với database
- **View**: giao diện Pug hiển thị cho người dùng
- **Controller**: nhận request, điều phối xử lý và render view

Luồng chạy cơ bản:

```txt
Browser
  ↓
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
  ↓
Controller
  ↓
Pug View
  ↓
Browser
```

Ví dụ với chức năng đăng ký (đã đi đủ các lớp):

```txt
POST /auth/dang-ky
  ↓
routes/xac-thuc.route.js
  ↓
middlewares/kiem-tra-dang-ky.middleware.js
  ↓
controllers/auth.controller.js
  ↓
models/nguoi-dung.model.js + models/OTP.model.js
services/email.service.js (gửi email OTP)
  ↓
redirect sang /auth/xac-nhan-otp -> views/pages/auth/xac-nhan-otp.pug
```

Ví dụ với trang thực đơn (hiện route đang gọi model trực tiếp, sau này nên tách ra controller/service):

```txt
GET /thuc-don
  ↓
routes/san-pham.route.js
  ↓
models/san-pham.model.js + models/danh-muc.model.js
  ↓
views/pages/san-pham/thuc-don.pug
```

## Quy ước đặt tên

Folder theo design pattern MVC sẽ dùng tiếng Anh để đúng chuẩn chung:

```txt
models/
controllers/
routes/
services/
middlewares/
views/
config/
public/
```

File chức năng bên trong ưu tiên dùng tiếng Việt không dấu để cả nhóm dễ hiểu.

Ví dụ:

```txt
san-pham.model.js
san-pham.route.js
san-pham.controller.js
san-pham.service.js

don-hang.model.js
gio-hang.controller.js
nguoi-dung.service.js
```

Nếu sau này team muốn đổi sang full English thì phải đổi đồng bộ cả chức năng, không nên trộn lung tung. Ví dụ nên tránh:

```txt
san-pham.model.js
product.controller.js
product.service.js
```

Route/URL hiển thị cho người dùng nên dùng tiếng Việt không dấu:

```txt
/thuc-don
/gio-hang
/thanh-toan
/dang-nhap
```

Route admin có thể dùng tiếng Anh cho ngắn gọn:

```txt
/admin/products
/admin/orders
/admin/categories
```

## Quy ước code chung

- Route chỉ khai báo đường dẫn và gọi controller
- Controller không nên viết quá nhiều logic tính toán
- Logic xử lý nên đưa vào service
- Service là nơi xử lý nghiệp vụ chính, ví dụ tính tổng tiền, tạo đơn hàng, lọc sản phẩm
- Service có thể gọi model để lấy hoặc lưu dữ liệu trong MongoDB
- Model chỉ tập trung vào schema và truy vấn database
- View chỉ nên hiển thị dữ liệu, không nên xử lý logic phức tạp
- File tĩnh như CSS, JS client, hình ảnh để trong `public`
- Biến môi trường để trong `.env`, không push `.env` lên GitHub

Luồng code nên đi theo thứ tự:

```txt
Route -> Controller -> Service -> Model -> MongoDB
```

Ví dụ chức năng đặt hàng:

```txt
gio-hang.route.js
  -> gio-hang.controller.js
  -> gio-hang.service.js
  -> san-pham.model.js / don-hang.model.js
```

## Chức năng dự kiến

Phía khách hàng:

- Xem trang chủ
- Xem danh sách món ăn
- Xem chi tiết món ăn
- Thêm món vào giỏ hàng
- Đặt hàng
- Đăng ký, đăng nhập
- Xem lịch sử đơn hàng

Phía admin:

- Quản lý món ăn
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý người dùng
- Xem thống kê cơ bản

## Ghi chú cho thành viên clone về làm

Mọi người nên code theo đúng cấu trúc trên để dự án không bị rối.

Khi làm chức năng mới, hãy tạo đủ file theo nhóm MVC. Ví dụ làm chức năng giỏ hàng:

```txt
src/models/gio-hang.model.js
src/routes/gio-hang.route.js
src/controllers/gio-hang.controller.js
src/services/gio-hang.service.js
src/views/pages/gio-hang/gio-hang.pug
src/public/css/gio-hang/...
```

Làm như vậy thì người khác nhìn vào sẽ biết file nào làm nhiệm vụ gì, dễ review và sửa lỗi hơn.

Quy trình đưa code lên GitHub:

```bash
git checkout main
git pull origin main
git checkout -b feature/ten-tinh-nang
# ... code ...
npm run check
git add .
git commit -m "noi dung commit"
git push -u origin feature/ten-tinh-nang
```

Sau đó lên GitHub mở **Pull Request** vào `main`, đợi CI chạy xanh rồi mới merge. Không push thẳng lên `main`.

