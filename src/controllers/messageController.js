const db = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// ✅ Get Messages for a Room
exports.getMessages = (req, res) => {
  const { roomId } = req.params;

  const query = `
    SELECT * FROM messages 
    WHERE roomId = ? 
    ORDER BY createdAt ASC
  `;

  db.query(query, [roomId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};

// ✅ Send a Message
exports.sendMessage = (req, res) => {
  const { roomId, senderId, receiverId, message } = req.body;

  if (!roomId || !senderId || !receiverId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const messageId = uuidv4(); // Unique message ID
  const query = `
    INSERT INTO messages (id, roomId, sender, receiver, message) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [messageId, roomId, senderId, receiverId, message], (err) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true });
  });
};