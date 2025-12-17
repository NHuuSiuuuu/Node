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

module.exports.request = async (req, res) => {
  // Socket
  usersSocket(res);
  // End socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  console.log(requestFriends);

  const users = await User.find({
    _id: { $in: requestFriends }, // Lấy ra những người có id mà mình yêu cầu kết bạn
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

// Chức năng từ chối kb
module.exports.accept = async (req, res) => {
  // Socket
  usersSocket(res);
  // End socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });

  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: { $in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};

module.exports.friends = async (req, res) => {
  // Socket
  usersSocket(res);
  // End socket

  const userId = res.locals.user.id;

  const myUser = await User.findOne({
    _id: userId,
  });
  const friendList = myUser.friendList;
/* 
  friendList = [
  { user_id: "abc123", createdAt: ... },
  { user_id: "def456", createdAt: ... }
  ]
*/
  // Vì thằng friendList là mảng obj nên phải lặp qua nó
  const friendListId = friendList.map((item) => item.user_id);

  const users = await User.find({
    _id: { $in: friendListId },
    status: "active",
    deleted: false,
  }).select("id avatar fullName statusOnline");

  for (const user of users) {
    const infoFriend = friendList.find(    //  thằng này trả về  { user_id: "abc123", room_chat_id: "xyz789" },
      (friend) => friend.user_id == user.id
    );
    user.infoFriend = infoFriend
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users,
  });
};
