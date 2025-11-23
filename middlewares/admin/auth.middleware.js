const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");

module.exports.requireAuth = async (req, res, next) => {
  // Nếu không có token
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    // console.log(req.cookies.token);
    // Khi có token - kiểm tra xem token đấy có giống với token đã lưu không tránh trường hợp người dùng dửa tooken ngoài trang web
    const user = await Account.findOne({ token: req.cookies.token }).select(
      "-password"
    );
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      // Tạo biến toàn cục

      const role = await Role.findOne({
        _id: user.role_id,
      });
      res.locals.user = user;
      res.locals.role = role;

      next();
    }
  }
};
