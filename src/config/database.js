const dns = require("dns");
const mongoose = require("mongoose");

// Chỉ định Google DNS để phân giải bản ghi SRV của MongoDB Atlas
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Ket noi MongoDB thanh cong");
  } catch (error) {
    console.error("Ket noi MongoDB that bai:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
