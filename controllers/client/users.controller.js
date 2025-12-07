const User = require("../../models/user.model");

module.exports.notFriend = async (req, res) => {
  // Lấy toàn bộ user chỉ trừ user đang đăng nhập
  const userId = res.locals.user.id;

  const users = await User.find({
    _id: { $ne: userId },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  console.log(users);

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
