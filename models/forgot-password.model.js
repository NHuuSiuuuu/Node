const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    // Thời gian hết hạn là 11s. sau 11s nó sẽ xóa trong database
    expireAt: { type: Date, expires: 11 },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
); // Đối số thứ 3 là bảng colection

module.exports = ForgotPassword;
