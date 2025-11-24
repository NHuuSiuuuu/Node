const express = require("express");
const router = express.Router();
const validate = require("../../validates/admin/auth.validate.js");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const controller = require("../../controllers/admin/my-account.controller.js");

router.get("/", controller.index);

// Trang này chỉ khác trang chỉnh sửa tài khoản là không được phép chọn quyền

router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;
