const express = require("express");
const router = express.Router();
const db = require("../db/connection"); // adjust if your DB module is elsewhere

// Fetch all unread notifications for a user
router.get("/notifications/:userId", (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = `
    SELECT id, userId, type, roomId, senderId, message, isUnread, createdAt
    FROM notifications
    WHERE userId = ? 
    ORDER BY createdAt DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching notifications:", err);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json({ notifications: results });
  });
});



// routes/notifications.js or wherever appropriate
router.post("/notifications/mark-read", (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID required" });

  const query = `UPDATE notifications SET isUnread = false WHERE userId = ? AND isUnread = true`;
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error marking notifications as read:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true });
  });
});



module.exports = router;