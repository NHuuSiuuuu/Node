const md5 = require("md5");
const Account = require("../../models/account.model");

module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index.pug", {
    pageTitle: "Thông tin cá nhân",
  });
};

module.exports.edit = (req, res) => {
  res.render("admin/pages/my-account/edit.pug", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};

// Trang này chỉ khác trang chỉnh sửa tài khoản là không được phép chọn quyền

module.exports.editPatch = async (req, res) => {
  console.log(req.body);
  const id = res.locals.user.id;

  // update lại ảnh nếu có ảnh mới
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  // Kiểm tra email đẫ tồn tại hay chưa
  const emailExist = await Account.findOne({
    _id: { $ne: id }, //     _id: {$ne: id} - not equal(khác với) là câu đk của MongoDB - tìm những email của các tài khoản mà _id không phải id hiện tại đang sửa
    email: req.body.email,
    deleted: false,
  });
  //   Nếu đã có email
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.get("Referer"));
  } else {
    req.body.password = md5(req.body.password);
  }
  // Nếu update lại pw thì mã hóa cho nó
  if (req.body.password) {
    req.body.password = md5(req.body.password);
  } else {
    // Ban đầu nếu người dùng không update mật khẩu dữ nguyên mật khẩu thì xóa pw để không update lại trong database
    delete req.body.password;
  }
  await Account.updateOne({ _id: id }, req.body);
  req.flash("success", `Cập nhật thành cônng`);

  res.redirect(req.get("Referer"));
};
