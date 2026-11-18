const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Định nghĩa cấu trúc Schema lưu trữ mã OTP và thông tin đăng ký tạm thời
const soDoMaOTP = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    maOTP:{
        type: String,
        required: true,
    },
    hoTen: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    thoiGianTao: {
        type: Date,
        default: Date.now,
        expires:300 //Tự động xóa khỏi database sau 5 phút (300 giây)
    }
});
soDoMaOTP.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Xuất Model "MaOTP"
module.exports = mongoose.model("MaOTP", soDoMaOTP);
