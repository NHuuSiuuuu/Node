const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

const md5 = require("md5");

module.exports.login = (req, res) => {
  console.log(req.cookies.token);
  //   Khi đăng nhập thành công rồi mà người dùng cố chuyển sang trang đăng nhập tài khoản thẻ render luôn về trang dashboard
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Đăng nhập",
    });
  }
};

module.exports.loginPost = async (req, res) => {
  // const email = req.body.password;

  const { email, password } = req.body;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  //   Kiểm tra nếu email không tồn tại
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect(req.get("Referer"));
    return;
  }
  //   Nếu mật khẩu không đúng
  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect(req.get("Referer"));
    return;
  }

  //   Nếu tài khoản bị khóa - tức là status ==
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect(req.get("Referer"));
    return;
  }
  res.cookie("token", user.token);

  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

// Đăng xuất
module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
