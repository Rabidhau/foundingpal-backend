
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
        cr.isGroup,
        cr.group_name, -- Group name if it’s a group chat
        cr.user1 AS creatorId,

        -- For one-to-one chat details
        IF(cr.isGroup = 0, u.userId, NULL) AS userId,
        IF(cr.isGroup = 0, u.username, NULL) AS username,
        IF(cr.isGroup = 0, u.profile_image, NULL) AS profile_image,

        -- Last message details
        (SELECT message FROM messages WHERE roomId = cr.roomId ORDER BY createdAt DESC LIMIT 1) AS lastMessage,
        (SELECT createdAt FROM messages WHERE roomId = cr.roomId ORDER BY createdAt DESC LIMIT 1) AS lastMessageTime,

        -- Group members' user IDs (array of IDs)
        IF(cr.isGroup = 1, 
            cr.user2, -- Just return the user2 JSON array (the array of user IDs in the group)
            NULL) AS groupMembersIds

    FROM chat_rooms cr

    LEFT JOIN Users u 
      ON cr.isGroup = 0 AND (u.userId = cr.user1 OR u.userId = cr.user2)

    WHERE 
      (
        cr.isGroup = 0 AND (cr.user1 = ? OR cr.user2 = ?) AND u.userId != ?
      )
      OR (
        cr.isGroup = 1 AND (
          cr.user1 = ? OR JSON_CONTAINS(cr.user2, JSON_QUOTE(?))
        )
      )

    ORDER BY lastMessageTime DESC;
  `;

  db.query(query, [userId, userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching chat rooms:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }

    // Send the results back to the frontend
    res.json(results);
  });
};

exports.createGroupRoom = (req, res) => {
  const { creatorId, groupName, memberIds } = req.body;

  if (!creatorId || !groupName || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ error: "Missing required group creation fields" });
  }

  const roomId = uuidv4(); // Unique room ID
  const isGroup = 1;
  const membersString = JSON.stringify(memberIds); // Storing members in user2 field as JSON string

  const createGroupQuery = `
    INSERT INTO chat_rooms (roomId, user1, user2, isGroup, group_name)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(createGroupQuery, [roomId, creatorId, membersString, isGroup, groupName], (err) => {
    if (err) {
      console.error("Database error while creating group:", err);
      return res.status(500).json({ error: "Database error while creating group" });
    }

    return res.status(201).json({ roomId, groupName, creatorId, members: [creatorId, ...memberIds] });
  });
};