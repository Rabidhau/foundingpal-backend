
const { v4: uuidv4 } = require("uuid");
const db = require("../db/connection");

exports.createRoom = (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: "Missing sender or receiver" });
  }

  const roomId = uuidv4(); // Generate a unique room ID

  // Atomic Insert: Ensure only one room is created
  const createQuery = `
    INSERT INTO chat_rooms (roomId, user1, user2)
    SELECT * FROM (SELECT ? AS roomId, ? AS user1, ? AS user2) AS tmp
    WHERE NOT EXISTS (
        SELECT roomId FROM chat_rooms 
        WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?)
    ) LIMIT 1;
  `;

  db.query(createQuery, [roomId, senderId, receiverId, senderId, receiverId, receiverId, senderId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // Fetch the existing or newly created room ID
    const getRoomQuery = `SELECT roomId FROM chat_rooms WHERE (user1 = ? AND user2 = ?) OR (user1 = ? AND user2 = ?) LIMIT 1`;

    db.query(getRoomQuery, [senderId, receiverId, receiverId, senderId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.json({ roomId: results[0].roomId });
    });
  });
};
exports.getChatRooms = (req, res) => {
    const { userId } = req.params;

    const query = `
      SELECT 
          cr.roomId, 
          u.userId, 
          u.username, 
          u.profile_image AS profile_image,
          (SELECT message FROM messages WHERE roomId = cr.roomId ORDER BY createdAt DESC LIMIT 1) AS lastMessage,
          (SELECT createdAt FROM messages WHERE roomId = cr.roomId ORDER BY createdAt DESC LIMIT 1) AS lastMessageTime
      FROM chat_rooms cr
      JOIN Users u ON (u.userId = cr.user1 OR u.userId = cr.user2)
      WHERE 
          cr.roomId IN (
              SELECT DISTINCT roomId FROM chat_rooms WHERE user1 = ? OR user2 = ?
          )
          AND u.userId != ?
      ORDER BY lastMessageTime DESC;
    `;

    db.query(query, [userId, userId, userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        res.json(results);
    });
};