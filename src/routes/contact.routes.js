const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getAllMessages,
} = require("../controllers/contact.controller");
const auth = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/role.middleware');

router.post("/", sendMessage);

// admin route
router.get("/", auth, isAdmin, getAllMessages);

module.exports = router;