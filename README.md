# Dự án gà rán ChipChip

Website bán gà rán online được xây dựng bằng **Node.js + Express.js + MongoDB + Pug**.

Dự án này render giao diện trực tiếp từ server bằng **Pug**, nên không tách frontend riêng. Tất cả code nằm chung trong một project Express.

## Công nghệ sử dụng

- **Node.js**: môi trường chạy JavaScript phía server
- **Express.js**: framework tạo server và xử lý route
- **MongoDB**: cơ sở dữ liệu NoSQL
- **Mongoose**: thư viện làm việc với MongoDB dễ hơn
- **Pug**: template engine để render HTML từ server
- **Nodemon**: tự động restart server khi code thay đổi

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
nodemon
```

Nếu tạo project từ đầu và muốn cài thủ công thì dùng:

```bash
npm install express mongoose pug dotenv
npm install --save-dev nodemon
```

Tạo file `.env` dựa theo mẫu `.env.example`, ví dụ:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ga_ran_chipchip
```

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

Chạy server ở môi trường dev:

```bash
npm run dev
```

Chạy server bình thường:

```bash
npm start
```

## Cấu trúc thư mục

```txt
Du_an_ga_ran_ChipChip/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── public/
│   │   ├── css/
│   │   ├── images/
│   │   │   ├── banner/
│   │   │   └── products/
│   │   └── js/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── views/
│   │   ├── admin/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── partials/
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## Ý nghĩa từng thư mục

### `src/config`

Chứa các file cấu hình của dự án.

Ví dụ:

- `database.js`: kết nối MongoDB
- `env.js`: đọc biến môi trường nếu cần

### `src/models`

Chứa schema MongoDB bằng Mongoose.

Mỗi collection nên có một file model riêng.

Ví dụ:

```txt
nguoi-dung.model.js
san-pham.model.js
danh-muc.model.js
don-hang.model.js
```

### `src/routes`

Chứa các đường dẫn của website.

Route chỉ nên khai báo URL và gọi controller, không nên viết logic dài trong route.

Ví dụ:

```txt
trang-chu.route.js
san-pham.route.js
gio-hang.route.js
don-hang.route.js
dang-nhap.route.js
admin.route.js
```

### `src/controllers`

Controller nhận request từ route, gọi service nếu cần, sau đó render view Pug.

Ví dụ:

```txt
san-pham.controller.js
```

Có thể render trang danh sách món ăn:

```js
res.render("pages/products", {
  title: "Thực đơn",
  products
});
```

### `src/services`

Chứa logic xử lý nghiệp vụ.

Ví dụ:

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
views/pages/
```

Chứa các trang cho khách hàng, ví dụ:

- Trang chủ
- Thực đơn
- Chi tiết món ăn
- Giỏ hàng
- Thanh toán
- Đăng nhập
- Đăng ký

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

- `css/style.css`
- `js/main.js`
- `images/products/`
- `images/banner/`

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

Ví dụ với trang thực đơn:

```txt
GET /thuc-don
  ↓
routes/san-pham.route.js
  ↓
controllers/san-pham.controller.js
  ↓
services/san-pham.service.js
  ↓
models/san-pham.model.js
  ↓
views/pages/products.pug
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

Khi làm chức năng mới, hãy tạo đủ file theo nhóm MVC. Ví dụ làm chức năng sản phẩm:

```txt
src/models/san-pham.model.js
src/routes/san-pham.route.js
src/controllers/san-pham.controller.js
src/services/san-pham.service.js
src/views/pages/products.pug
```

Làm như vậy thì người khác nhìn vào sẽ biết file nào làm nhiệm vụ gì, dễ review và sửa lỗi hơn.

