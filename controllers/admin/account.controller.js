const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");

const systemConfig = require("../../config/system");
const md5 = require("md5");

//  [GET]
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select("-password -token"); // lấy tất cả trừ pw và token
  //   console.log(records)
  for (const record of records) {
    // lặp qua các bản ghi để lấy ra title cuả từng bản dựa vào role_id
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false,
    });
    record.role = role;
  }

  res.render("admin/pages/account/index.pug", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};
// [GET]
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render("admin/pages/account/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

module.exports.createPost = async (req, res) => {
  // Kiểm tra email đẫ tồn tại hay chưa
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  //   console.log(emailExist);

  //   Nếu đã có email
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(req.get("Referer"));
  } else {
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    console.log("reqq:", req.body);
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[GET] Sửa tài khoản
module.exports.edit = async (req, res) => {
  const find = {
    deleted: false,
    _id: req.params.id,
  };
  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/account/edit", {
      pageTitle: "Chỉnh sủa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

//[PATCH] Sửa tài khoản
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  // update lại ảnh nếu có ảnh mới
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  // Kiểm tra email đẫ tồn tại hay chưa
  const emailExist = await Account.findOne({
    _id: {$ne: id}, //     _id: {$ne: id} - not equal(khác với) là câu đk của MongoDB - tìm những email của các tài khoản mà _id không phải id hiện tại đang sửa
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
  console.log(req.body);
  await Account.updateOne({ _id: id }, req.body);
  req.flash("success", `Cập nhật thành cônng`);

  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
