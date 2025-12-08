const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserID = res.locals.user.id;

      //   console.log(myUserID); // Id của A
      //   console.log(userId); // Id của B

      //   1. Khi A gửi Yêu cầu cho B

      // Thêm id của A vào acceptFriends của B
      // kiểm tra id của A trong B tồn tại chưa
      const existIdAinB = await User.findOne({
        _id: userId, // Tìm ông B xem accept có ông A trong đấy chưa
        acceptFriends: myUserID,
      });

      //   Nếu không có thì mới lưu
      if (!existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserID }, // lưu id của A vào accept của B
          }
        );
      }

      // Thêm id của B vào request Friends của A
      const existIdBinA = await User.findOne({
        _id: myUserID, // Tìm ông A (tức là mình) xem request yêu cầu đã có ông B trong đấy chưa
        requestFriends: userId,
      });

      //   Nếu không có thì mới lưu
      if (!existIdBinA) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
    });

    // Chức năng hủy gửi yêu cầu
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserID = res.locals.user.id;

      // Xóa id của A trong accept của B
      const existIdAinB = await User.findOne({
        _id: userId, // Tìm ông B xem accept có ông A trong đấy chưa
        acceptFriends: myUserID,
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserID },
          }
        );
      }

      // Xóa id của B vào request Friends của A
      const existIdBinA = await User.findOne({
        _id: myUserID, 
        requestFriends: userId,
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });
  });
};
