const RoomChat = require("../../models/rooms-chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../sockets/client/chat.socket");

// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const listRoomChat = await RoomChat.find({
    "users.user_id": userId, // Kiểm tra từng obj 1 xem có user id nào trùng với id đang đăng nhập
    typeRoom: "group",
    deleted: false,
  });
  // console.log(listRoomChat)
  res.render("client/pages/rooms-chat/index.pug", {
    pageTitle: "Danh sách phòng",
    listRoomChat: listRoomChat,
  });
};

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
  const friendList = res.locals.user.friendList;

  for (const friend of friendList) {
    const infoFriend = await User.findOne({
      _id: friend.user_id,
      deleted: false,
    }).select("fullName avatar");

    friend.infoFriend = infoFriend; // thêm key infoFriend
  }

  res.render("client/pages/rooms-chat/create.pug", {
    pageTitle: "Danh sách phòng",
    friendList: friendList, // Danh sách bạn bè của user đang đăng nhập
  });
};

/* MẪU DATA ĐỂ LÀM THẰNG NÀY
{
  title: 'Nguyễn Ngọc Hữu Nguye Huu ccc',
  typeRoom: 'group',
  users: [
    { user_id: '69419c18b50eef8d2e5f8664', role: 'user' },
    { user_id: '69419da2506022f563cc14a8', role: 'user' },
    { user_id: '69419f4bc92a2351240ccf7e', role: 'superAdmin' }
  ]
}
*/
module.exports.createPost = async (req, res) => {
  const title = req.body.title;
  const usersId = req.body.usersId; // Trả về mảng: [ '69419c18b50eef8d2e5f8664', '69419da2506022f563cc14a8' ]

  const dataRoom = {
    title: title,
    typeRoom: "group",
    users: [],
  };

  //   Lặp qua từng user id trong mảng usersId
  for (const userId of usersId) {
    dataRoom.users.push({
      user_id: userId,
      role: "user", // ông B và ông C mặc định là quyền user
    });
  }

  //   Thêm id và quyền của ông A (tức là người tạo ra nhóm)
  dataRoom.users.push({
    user_id: res.locals.user.id,
    role: "superAdmin",
  });

  const roomChat = new RoomChat(dataRoom);
  await roomChat.save();

  //   console.log(title);
  //   console.log(usersId);
  console.log(dataRoom);

  res.redirect(`/chat/${roomChat.id}`);
};
