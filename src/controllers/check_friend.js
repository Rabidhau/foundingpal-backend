const conn = require("../db/connection");

const checkFriendStatus = async (req, res) => {
  const { userId, friendId } = req.query;

  try {
    // Query to check if the user has friends
    const selectQuery = "SELECT friendId FROM user_friends WHERE userId = ?";

    conn.query(selectQuery, [userId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error selecting friends from db:", selectErr);
        return res.status(500).json({ error: "Error selecting user from database" });
      }

      // If no friends exist for this user, return false
      if (selectResult.length === 0) {
        return res.json({ isRequestSent: false });
      }

      let existingFriendIds = [];

      try {
        existingFriendIds = JSON.parse(selectResult[0].friendId); // Parse stored friendId array
        if (!Array.isArray(existingFriendIds)) {
          throw new Error("Invalid friendId format");
        }
      } catch (error) {
        console.error("Error parsing friendId from DB:", error);
        return res.status(500).json({ error: "Database error: Invalid friendId format" });
      }

      // Check if the friendId already exists
      const isRequestSent = existingFriendIds.includes(friendId);

      return res.json({ isRequestSent });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { checkFriendStatus };