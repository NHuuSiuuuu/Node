const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const controller = require("../../controllers/admin/account.controller");
const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  controller.createPost
);

module.exports = router;
