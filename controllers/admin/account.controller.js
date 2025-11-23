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
  for (const record of records) { // lặp qua các bản ghi để lấy ra title cuả từng bản dựa vào role_id
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
