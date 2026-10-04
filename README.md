# Du an ga ran ChipChip

Website ban ga ran online duoc xay dung bang **Node.js + Express.js + MongoDB + Pug**.

Du an nay render giao dien truc tiep tu server bang **Pug**, nen khong tach frontend rieng. Tat ca code nam chung trong mot project Express.

## Cong nghe su dung

- **Node.js**: moi truong chay JavaScript phia server
- **Express.js**: framework tao server va xu ly route
- **MongoDB**: co so du lieu NoSQL
- **Mongoose**: thu vien lam viec voi MongoDB de hon
- **Pug**: template engine de render HTML tu server
- **Nodemon**: tu dong restart server khi code thay doi

## Cach chay du an

Clone project ve may:

```bash
git clone <link-repository>
cd Du_an_ga_ran_ChipChip
```

Cai thu vien:

```bash
npm install
```

Tao file `.env` dua theo mau `.env.example`, vi du:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/ga_ran_chipchip
```

## Cau hinh MongoDB

Code trong du an da co san phan ket noi MongoDB bang Mongoose:

```txt
src/config/database.js
```

Nhung de ket noi duoc thi van can co database MongoDB that. Co 2 cach dung:

### Cach 1: Dung MongoDB local

Neu dung local, may can cai:

- **MongoDB Community Server**: database server chay tren may
- **MongoDB Compass**: giao dien de xem database, cai nay khong bat buoc nhung nen co

Khi MongoDB local dang chay, dung cau hinh:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/ga_ran_chipchip
```

Neu chua cai MongoDB local ma van dung link nay, server se bao loi ket noi, thuong gap:

```txt
ECONNREFUSED 127.0.0.1:27017
```

Loi nay khong phai do code sai, ma do may chua co MongoDB server dang chay.

### Cach 2: Dung MongoDB Atlas

MongoDB Atlas la database online. Cach nay khong can cai MongoDB tren may, chi can internet va connection string.

Trong `.env`, thay `MONGODB_URI` bang link Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ga_ran_chipchip
```

Vi du minh hoa:

```env
MONGODB_URI=mongodb+srv://chipchip_user:matkhaucuaban@cluster0.xxxxx.mongodb.net/ga_ran_chipchip
```

Khi dung Atlas can luu y:

- Khong push file `.env` len GitHub
- Chi push `.env.example` de lam mau
- Username, password, cluster URL that chi de trong `.env` tren may moi nguoi
- Trong Atlas can cho phep IP truy cap database

Tom lai:

```txt
Mongoose = thu vien Node.js dung de ket noi MongoDB
MongoDB local hoac Atlas = database that
```

Neu khong co MongoDB local hoac Atlas, server se khong ket noi database duoc.

Chay server o moi truong dev:

```bash
npm run dev
```

Chay server binh thuong:

```bash
npm start
```

## Cau truc thu muc

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

## Y nghia tung thu muc

### `src/config`

Chua cac file cau hinh cua du an.

Vi du:

- `database.js`: ket noi MongoDB
- `env.js`: doc bien moi truong neu can

### `src/models`

Chua schema MongoDB bang Mongoose.

Moi collection nen co mot file model rieng.

Vi du:

```txt
user.model.js
product.model.js
category.model.js
order.model.js
```

### `src/routes`

Chua cac duong dan cua website.

Route chi nen khai bao URL va goi controller, khong nen viet logic dai trong route.

Vi du:

```txt
home.route.js
product.route.js
cart.route.js
order.route.js
auth.route.js
admin.route.js
```

### `src/controllers`

Controller nhan request tu route, goi service neu can, sau do render view Pug.

Vi du:

```txt
product.controller.js
```

Co the render trang danh sach mon an:

```js
res.render("pages/products", {
  title: "Thuc don",
  products
});
```

### `src/services`

Chua logic xu ly nghiep vu.

Vi du:

- Lay danh sach san pham
- Tinh tong tien gio hang
- Tao don hang
- Cap nhat trang thai don hang

Controller nen goi service de code gon hon.

### `src/middlewares`

Chua cac middleware dung chung cho Express.

Vi du:

- Kiem tra nguoi dung da dang nhap chua
- Kiem tra quyen admin
- Xu ly loi 404 hoac loi server

### `src/views`

Chua toan bo file giao dien Pug.

Du an nay dung server-side rendering, nen HTML se duoc render tu cac file trong thu muc nay.

```txt
views/layouts/
```

Chua layout chung cua website, vi du `main.pug`.

```txt
views/partials/
```

Chua cac phan giao dien dung lai nhieu noi, vi du:

- `header.pug`
- `navbar.pug`
- `footer.pug`

```txt
views/pages/
```

Chua cac trang cho khach hang, vi du:

- Trang chu
- Thuc don
- Chi tiet mon an
- Gio hang
- Thanh toan
- Dang nhap
- Dang ky

```txt
views/admin/
```

Chua cac trang quan tri, vi du:

- Dashboard
- Quan ly mon an
- Quan ly danh muc
- Quan ly don hang
- Quan ly nguoi dung

Neu giai doan dau chua lam admin thi co the de trong.

### `src/public`

Chua file tinh duoc trinh duyet tai truc tiep.

Vi du:

- `css/style.css`
- `js/main.js`
- `images/products/`
- `images/banner/`

### `src/utils`

Chua cac ham tien ich dung lai nhieu noi.

Vi du:

- Format tien Viet Nam
- Tao slug san pham
- Format ngay thang

## Design pattern su dung

Du an di theo mo hinh **MVC**.

MVC gom 3 phan chinh:

- **Model**: lam viec voi database
- **View**: giao dien Pug hien thi cho nguoi dung
- **Controller**: nhan request, dieu phoi xu ly va render view

Luong chay co ban:

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

Vi du voi trang thuc don:

```txt
GET /thuc-don
  ↓
routes/product.route.js
  ↓
controllers/product.controller.js
  ↓
services/product.service.js
  ↓
models/product.model.js
  ↓
views/pages/products.pug
```

## Quy uoc dat ten

Folder theo design pattern MVC se dung tieng Anh de dung chuan chung:

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

File chuc nang ben trong co the dung tieng Viet khong dau hoac full English, mien la team thong nhat mot kieu va di theo kieu do.

Vi du kieu tieng Viet khong dau:

```txt
san-pham.model.js
san-pham.route.js
san-pham.controller.js
san-pham.service.js

don-hang.model.js
gio-hang.controller.js
nguoi-dung.service.js
```

Vi du kieu full English:

```txt
product.model.js
product.route.js
product.controller.js
product.service.js

order.model.js
cart.controller.js
user.service.js
```

Khong nen tron lung tung trong cung mot chuc nang. Vi du nen tranh:

```txt
san-pham.model.js
product.controller.js
product.service.js
```

Route/URL hien thi cho nguoi dung nen dung tieng Viet khong dau:

```txt
/thuc-don
/gio-hang
/thanh-toan
/dang-nhap
```

Route admin co the dung tieng Anh cho ngan gon:

```txt
/admin/products
/admin/orders
/admin/categories
```

## Quy uoc code chung

- Route chi khai bao duong dan va goi controller
- Controller khong nen viet qua nhieu logic tinh toan
- Logic xu ly nen dua vao service
- Service la noi xu ly nghiep vu chinh, vi du tinh tong tien, tao don hang, loc san pham
- Service co the goi model de lay hoac luu du lieu trong MongoDB
- Model chi tap trung vao schema va truy van database
- View chi nen hien thi du lieu, khong nen xu ly logic phuc tap
- File tinh nhu CSS, JS client, hinh anh de trong `public`
- Bien moi truong de trong `.env`, khong push `.env` len GitHub

Luong code nen di theo thu tu:

```txt
Route -> Controller -> Service -> Model -> MongoDB
```

Vi du chuc nang dat hang:

```txt
gio-hang.route.js
  -> gio-hang.controller.js
  -> gio-hang.service.js
  -> san-pham.model.js / don-hang.model.js
```

## Chuc nang du kien

Phia khach hang:

- Xem trang chu
- Xem danh sach mon an
- Xem chi tiet mon an
- Them mon vao gio hang
- Dat hang
- Dang ky, dang nhap
- Xem lich su don hang

Phia admin:

- Quan ly mon an
- Quan ly danh muc
- Quan ly don hang
- Quan ly nguoi dung
- Xem thong ke co ban

## Ghi chu cho thanh vien clone ve lam

Moi nguoi nen code theo dung cau truc tren de du an khong bi roi.

Khi lam chuc nang moi, hay tao du file theo nhom MVC. Vi du lam chuc nang san pham:

```txt
src/models/san-pham.model.js
src/routes/san-pham.route.js
src/controllers/san-pham.controller.js
src/services/san-pham.service.js
src/views/pages/products.pug
```

Lam nhu vay thi nguoi khac nhin vao se biet file nao lam nhiem vu gi, de review va sua loi hon.
