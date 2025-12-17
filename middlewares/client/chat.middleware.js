const RoomChat = require("../../models/rooms-chat.model");

// Có được truy cập vào phòng chat này hay không
module.exports.isAccess = async (req, res, next) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;

  const existUserInRoomChat = await RoomChat.findOne({
    _id: roomChatId,
    "users.user_id": userId, // tìm xem có id nào = id đang đăng nhập
    deleted: false,
  });
  if (existUserInRoomChat) {
    next();
  } else {
    res.redirect("/");
  }

//   console.log("id room", roomChatId);
//   console.log("user id", userId);
//   console.log(existUserInRoomChat);
};
