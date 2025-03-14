const express = require("express");
const { getMessages, sendMessage } = require("../controllers/messageController");

const router = express.Router();

router.get("/:roomId", getMessages);
router.post("/send", sendMessage);

module.exports = router;