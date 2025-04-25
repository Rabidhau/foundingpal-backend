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

  const messageQuery = `
    INSERT INTO messages (id, roomId, sender, receiver, message) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const notificationQuery = `
    INSERT INTO notifications (id, userId, type, roomId, senderId, message)
    VALUES (?, ?, 'message', ?, ?, ?)
  `;

  // Ensure receiverIds is an array
  const receivers = isGroup && typeof receiverIds === 'string' ? JSON.parse(receiverIds) : [receiverId];

  receivers.forEach((receiver) => {
    const messageId = uuidv4();
    db.query(messageQuery, [messageId, roomId, senderId, receiver, message], (err) => {
      if (err) {
        console.error("Message insert error:", err);
        return res.status(500).json({ error: "Database error inserting message" });
      }

      // Insert the notification after the message is inserted
      const notificationId = uuidv4();
      db.query(notificationQuery, [notificationId, receiver, roomId, senderId, message], (notifErr) => {
        if (notifErr) {
          console.error("Notification insert error:", notifErr);
          return res.status(500).json({ error: "Database error inserting notification" });
        }
      });
    });
  });

  // Respond with success after processing
  res.json({ success: true });
};