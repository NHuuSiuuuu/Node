const md5 = require("md5");
const User = require("../../models/user.model");

module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

module.exports.registerPost = async (req, res) => {
  console.log(req.body);
  const existEmail = await User.findOne({
    email: req.body.email,
  });

  // Nếu tồn tại user đó
  if (existEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect(req.get("Referer"));
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  console.log(user);
  res.redirect("/");

  //   res.render("client/pages/user/register", {
  //     pageTitle: "Đăng ký tài khoản",
  //   });
};
