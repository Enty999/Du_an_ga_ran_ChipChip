const nodemailer = require("nodemailer");

// Khởi tạo phương tiện gửi thư qua dịch vụ Gmail
const phuongTienGuiMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm gửi thư chứa mã xác thực OTP đến email người dùng
const guiEmailXacThucOTP = async (emailNguoiNhan, maOTP) => {
  //Nội dung thư
  const noiDungThu = {
    from: `GaRanChipChip <${process.env.EMAIL_USER}>`,
    to: emailNguoiNhan,
    subject: "Xác thực tài khoản - GaRanChipChip",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #d32f2f; text-align: center;">GÀ RÁN CHIPCHIP</h2>
        <p>Xin chào bạn,</p>
        <p>Bạn đang đăng ký tài khoản tại hệ thống Gà Rán ChipChip. Mã xác thực (OTP) của bạn là:</p>
        <div style="text-align: center; margin: 25px 0;">
          <span style="display: inline-block; font-size: 28px; font-weight: bold; color: #d32f2f; background: #fff3e0; padding: 10px 25px; border-radius: 6px; letter-spacing: 5px;">
            ${maOTP}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Mã xác thực này có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động, vui lòng không phản hồi thư này.</p>
      </div>
        `,
  };
  return await phuongTienGuiMail.sendMail(noiDungThu);
};

module.exports = { guiEmailXacThucOTP };
