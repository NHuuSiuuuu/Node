const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  // Nếu không có token
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
  } else {
    // Khi có tokenUser - kiểm tra xem tokenUser đấy có giống với tokenUser đã lưu không tránh trường hợp người dùng dửa tooken ngoài trang web
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
    }).select("-password");
    // Nếu không tồn tại
    if (!user) {
      res.redirect(`/user/login`);
    } else {
      // Tạo biến toàn cục

      res.locals.user = user;

      next();
    }
  }
};
