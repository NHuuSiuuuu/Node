const express = require("express");
const router = express.Router();
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter")
const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate")

router.get("/", controller.product);

// route động dùng :
// router.get("/change-status/:status/:id", controller.changeStatus)

// Thêm method-override phải đổi get sang patch
router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

// get này để chuyển sang trang
router.get("/create", controller.createItem);

router.post(
    "/create", 
    upload.single("thumbnail"), 
    validate.createPost,
    controller.createPost
);

// Sửa sản phẩm
router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id", 
    upload.single("thumbnail"), 
    validate.createPost,
    controller.editPatch
);

// Chi tiết sản phẩm
router.get("/detail/:id", controller.detail);


module.exports = router;
