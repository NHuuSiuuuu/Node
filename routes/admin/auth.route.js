const express = require("express");
const router = express.Router();
const validate = require("../../validates/admin/auth.validate.js");

const controller = require("../../controllers/admin/auth.controller.js");

router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);

module.exports = router;
