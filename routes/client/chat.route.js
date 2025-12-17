const express = require("express");

const router = express.Router();

const controller = require("../../controllers/client/chat.controller");
const authMiddleware = require("../../middlewares/client/auth.middleware");
const chatMiddleware = require("../../middlewares/client/chat.middleware");

router.get(
  "/:roomChatId",
  authMiddleware.requireAuth,
  chatMiddleware.isAccess,
  controller.index
);

module.exports = router;
