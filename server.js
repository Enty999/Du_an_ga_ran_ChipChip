require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const PORT = process.env.PORT || 3007;

// Các biến môi trường bắt buộc phải có trong file .env
const BIEN_MOI_TRUONG_BAT_BUOC = ["MONGODB_URI", "JWT_SECRET"];

const startServer = async () => {
  // Thiếu biến môi trường -> Báo lỗi rõ ràng và dừng server ngay, không kết nối DB
  const bienThieu = BIEN_MOI_TRUONG_BAT_BUOC.filter((ten) => !process.env[ten]);
  if (bienThieu.length > 0) {
    console.error(
      `Thieu bien moi truong bat buoc: ${bienThieu.join(", ")}. ` +
        "Hay tao file .env (tham khao .env.example) va dien day du gia tri."
    );
    process.exit(1);
  }

  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
  });
};


startServer();
