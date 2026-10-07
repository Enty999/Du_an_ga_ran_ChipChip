const mongoose = require("mongoose");

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

//Xuất Model "MaOTP"
module.exports = mongoose.model("MaOTP", soDoMaOTP);