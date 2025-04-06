const db = require("../db/connection");
const { v4: uuidv4 } = require("uuid");

// ✅ Get Messages for a Room
exports.getMessages = (req, res) => {
  const { roomId } = req.params;

  // Modify the query to group by message content to ensure only one message per group is fetched
  const query = `
    SELECT DISTINCT message, sender, roomId, createdAt 
    FROM messages
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

exports.sendMessage = (req, res) => {
  const { roomId, senderId, receiverId, message, isGroup, receiverIds } = req.body;

  if (!roomId || !senderId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO messages (id, roomId, sender, receiver, message) 
    VALUES (?, ?, ?, ?, ?)
  `;

  // Ensure receiverIds is an array (parse if it's a string)
  let receivers = isGroup && typeof receiverIds === 'string' ? JSON.parse(receiverIds) : [receiverId];

  if (isGroup) {
    // For group chat, insert the message for each receiver in the group
    receivers.forEach((receiver) => {
      const messageId = uuidv4(); // Generate a new message ID for each receiver
      db.query(query, [messageId, roomId, senderId, receiver, message], (err) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Database error" });
        }
      });
    });
  } else {
    // For one-to-one chat, insert the message for the single receiver
    const messageId = uuidv4(); // Generate a new message ID for one-to-one chat
    db.query(query, [messageId, roomId, senderId, receiverId, message], (err) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
    });
  }

  // Respond with success after processing
  res.json({ success: true });
};