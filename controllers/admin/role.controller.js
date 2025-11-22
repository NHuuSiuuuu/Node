const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

module.exports.createPost = async (req, res) => {
  console.log(req.body);
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

module.exports.permissionsPatch = async (req, res) => {
  try {
    //  console.log(req.body)

    const permissions = JSON.parse(req.body.permissions); // Chuyển Json sang Js

    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    //   console.log(permissions);
    req.flash("success", "Cập nhật phân quyền thành công!");
    res.redirect(
      req.get("Referer") || `${systemConfig.prefixAdmin}/roles/permissions`
    );
  } catch (error) {
    req.flash("success", "Cập nhật phân quyền thành công!");
    req.get("Referer") || `${systemConfig.prefixAdmin}/roles/permissions`;
  }
};
