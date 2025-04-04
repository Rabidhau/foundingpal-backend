const express = require("express");
const db = require("../db/connection"); 

const router = express.Router();

router.get("/notifications/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // MySQL query to fetch notifications
    const query = `
      SELECT id, userId, type, message, createdAt, isUnread 
      FROM notifications 
      WHERE userId = ? 
      ORDER BY createdAt DESC
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("❌ Error fetching notifications:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "No notifications found" });
      }
      res.json({ notifications: results });
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
