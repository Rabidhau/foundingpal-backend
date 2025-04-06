const express = require("express");
const { createRoom, getChatRooms, createGroupRoom } = require("../controllers/chatController");

const router = express.Router();

// Create a chat room (or return existing one)
router.post("/create-room", createRoom);
router.post("/create-group", createGroupRoom);

// Get chat rooms for a user (with last messages)
router.get("/:userId", getChatRooms);

module.exports = router;