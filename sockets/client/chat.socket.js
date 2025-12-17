const uploadToCloudinary = require("../../helpers/uploadCloudinary");
const Chat = require("../../models/chat.model");

// Tách ra như này sẽ ko có res
module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;

  // Socket IO
  // Lắng nghe sự kiện gửi tin nhắn lên server
  // Dùng on mỗi lần reload lại trang web sẽ tạo 1 socket mới khiến nó nó tạo nhiều bản ghi trong db
  // Thay vào đấy dùng once
  _io.once("connection", (socket) => {
    // Đi vào phòng đó và phát ra tín hiệ
    socket.join(roomChatId);
    // console.log("a user connected", socket.id);
    // Đoạn code này lắng nghe gửi tin nhắn lên
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }
      console.log(images);
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        image: images, // nhở fix image bên model phải là images
      });
      await chat.save();

      // //  Trả data về client
      // Đi vào phòng đó và phát ra tín hiệu
      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        image: images,
      });
    });

    // Đoạn code này lắng nghe gửi typing lên
    // Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });

    // End Typing
  });

  // End Socket IO
};
