const express = require("express");
const router = express.Router();
const multer = require("multer");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const controller = require("../../controllers/admin/product-category.controller");
const upload = multer();
const validate = require("../../validates/admin/product-category.validate.js");

router.get("/", controller.index);
router.get("/create", controller.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

// [PATCH] /change-status/:status/:id
router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;
