const SettingGeneral = require("../../models/settings-general.model");
const systemConfig = require("../../config/system");

// Thằng này đặc biệt chỉ có 1 bản ghi thôi
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};
module.exports.generalPatch = async (req, res) => {
  console.log(req.body);
  const settingGeneral = await SettingGeneral.findOne({});

  //   Kiểm tra xem đã có bản ghi chưa? - Nếu có rồi thì chỉ sửa thôi
  if (settingGeneral) {
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
    res.redirect(req.get("Referer"));
  } else {
    // Nếu chưa có bản ghi nào thì tạo mới
    const record = new SettingGeneral(req.body);
    await record.save();
    res.redirect(req.get("Referer"));
  }
};
