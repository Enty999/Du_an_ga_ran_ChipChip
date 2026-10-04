require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/database");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
  });
};

startServer();
