const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  // Socket IO
  // Lắng nghe sự kiện
  // Dùng on mỗi lần reload lại trang web sẽ tạo 1 socket mới khiến nó nó tạo nhiều bản ghi trong db
  // Thay vào đấy dùng once
  _io.once("connection", (socket) => {
    // console.log("a user connected", socket.id);
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      // console.log(content);
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();
    });
  });
  // End Socket IO

  // Lấy data ừ database
  const chats = await Chat.find({
    deleted:false
  })

  for(const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName")
    chat.infoUser = infoUser


  }
  console.log(chats)


  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
};
