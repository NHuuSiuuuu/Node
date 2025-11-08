// Vì trong express cung cấp hàm route nên phải import nó vào
const express = require("express")

const router = express.Router();

const controller = require("../../controllers/client/home.controller")

router.get("/", controller.home);

module.exports = router