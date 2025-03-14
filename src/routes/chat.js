const express = require("express");
const { createRoom, getChatRooms } = require("../controllers/chatController");

const router = express.Router();

// Create a chat room (or return existing one)
router.post("/create-room", createRoom);

// Get chat rooms for a user (with last messages)
router.get("/:userId", getChatRooms);

module.exports = router;