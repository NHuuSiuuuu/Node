const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: {
      type: String,
      default: "active",
    },

    // Danh sách yêu cầu kết bạn mình gửi đi (Những người ông A gửi kết bạn đi)
    requestFriends: Array,

    // Những người đã gửi yêu cầu kết bạn cho mình (Những người đã gửi kết bạn cho ông A )
    acceptFriends: Array,

    // Danh sách bạn bè
    friendList: [
      {
        user_id: String,
        room_chat_id: String,
      },
    ],
    statusOnline: String,

    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "user"); // Đối số thứ 3 là bảng colection

module.exports = User;
