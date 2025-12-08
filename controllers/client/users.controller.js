const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);
  // End socket

  // Lấy toàn bộ user chỉ trừ user đang đăng nhập
  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  console.log(requestFriends);

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    /**     🔍 Giải thích từng điều kiện
    1️⃣ { _id: { $ne: userId } }
    Loại chính bạn khỏi danh sách.
    ➡️ Không hiện ra user đang đăng nhập.

    2️⃣ { _id: { $nin: requestFriends } }
    Loại những người bạn đã gửi lời mời kết bạn.
    ➡️ Tránh hiện những user mà bạn đã request.

    3️⃣ { _id: { $nin: acceptFriends } }
    Loại những người đã gửi lời mời kết bạn cho bạn.
    ➡️ Tránh hiện những người đã gửi request đến bạn nhưng bạn chưa accept.

*/
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  // console.log(users);

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
