const express = require("express")
const router = express.Router()

const controller = require("../../controllers/admin/product.controller")

router.get("/", controller.product)

// route động dùng :
// router.get("/change-status/:status/:id", controller.changeStatus)

// Thêm method-override phải đổi get sang patch
router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.delete("/delete/:id", controller.deleteItem)


module.exports = router