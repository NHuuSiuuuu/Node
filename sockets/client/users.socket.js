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

      // Lấy ra độ dài acceptFriend của B vầ trả về cho B (vì thằng được gửi mới có thông báo chứ thằng gửi có thông báo làm đéo gì)
      const infoUser = await User.findOne({
        _id: userId,
      });
      const lengthAcceptFriends = infoUser.acceptFriends.length;
      // Trả về cho thằng B chứ không trả về cho thằng A
      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId: userId,
        lengthAcceptFriends: lengthAcceptFriends,
      });
      // Lấy info của A trả về cho B
      const infoUserA = await User.findOne({
        _id: myUserID,
      }).select("id avatar fullName");

      socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
        userId: userId,
        infoUserA: infoUserA,
      });
    });

    // Chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserID = res.locals.user.id;

      // Xóa id của A trong accept của B
      const existIdAinB = await User.findOne({
        _id: userId, //Vì acceptFriends nằm trong tài khoản của người nhận lời mời (người B). Tìm ông B xem accept có ông A trong đấy chưa
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

    // Chức năng từ chối kết bạn - đảo ngược lại lúc này là B xóa
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserID = res.locals.user.id;

      // Xóa id của A trong accept của B
      const existIdAinB = await User.findOne({
        _id: myUserID, // Vì acceptFriends nằm trong tài khoản của người nhận lời mời (người B).
        acceptFriends: userId,
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $pull: { acceptFriends: userId },
          }
        );
      }

      // Xóa id của B vào request Friends của A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserID,
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });

    // Chức năng chấp nhận kết bạn - Tức là B chấp nhận A
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserID = res.locals.user.id;
      // Lúc này myUserId  - Id của B
      // Lúc này userId  - Id của A

      // -- Thêm {user_id, room_chat_id} của A vào friendsList của B
      // Xóa id của A trong accept của B
      const existIdAinB = await User.findOne({
        _id: myUserID,
        acceptFriends: userId,
      });

      if (existIdAinB) {
        await User.updateOne(
          {
            _id: myUserID,
          },
          {
            $push: {
              friendList: {
                user_id: userId, // Thêm id của A vào friendList của B
                room_chat_id: "",
              },
            },
            $pull: { acceptFriends: userId },
          }
        );
      }

      // -- Thêm {user_id, room_chat_id} của B vào friendsList của A
      // Xóa id của B vào request Friends của A
      const existIdBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserID,
      });

      if (existIdBinA) {
        await User.updateOne(
          {
            _id: userId,
          },

          {
            push: {
              friendList: {
                user_id: myUserID, // Thêm id của B vào friendList của A
                room_chat_id: "",
              },
            },
            $pull: { requestFriends: myUserID },
          }
        );
      }
    });
  });
};
