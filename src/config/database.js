const mongoose = require("mongoose");

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
