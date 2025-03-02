const conn = require("../db/connection");

const friendReq = async (req, res) => {
  const { friendId, userId } = req.body;

  try {
    // Check if the friendId already exists in applied_user
    const selectQuery = "SELECT friendId FROM user_friends WHERE userId = ?";
    
    conn.query(selectQuery, [userId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error selecting friends from db:", selectErr);
        return res.status(400).send("Error selecting user from database");
      }

      if (selectResult.length > 0) {
        let existingfriendIds;
        try {
          existingfriendIds = JSON.parse(selectResult[0].friendId);
        } catch (error) {
          console.error("Error parsing friendId from DB:", error);
          return res.status(500).send("Database error: Invalid friendId format");
        }

        if (existingfriendIds.includes(friendId)) {
          // If friendId already exists for the userId, return an error
          return res.status(400).send("friend already applied for this user");
        }

        // Add the new friendId to the existing array
        existingfriendIds.push(friendId);
        const updatedfriendIds = JSON.stringify(existingfriendIds);

        // Update the record with the new friendId array
        const updateQuery = "UPDATE user_friends SET friendId = ? WHERE userId = ?";
        conn.query(updateQuery, [updatedfriendIds, userId], (updateErr) => {
          if (updateErr) {
            console.error("Error updating user in db:", updateErr);
            return res.status(400).send("Error updating user in database");
          }
          return res.status(200).send("Applied to user successfully");
        });
      } else {
        // If no record exists, create a new one with the friendId
        const newfriendIds = JSON.stringify([friendId]);
        const insertQuery = "INSERT INTO user_friends (userId, friendId) VALUES (?, ?)";
        conn.query(insertQuery, [userId, newfriendIds], (insertErr) => {
          if (insertErr) {
            console.error("Error inserting user in db:", insertErr);
            return res.status(400).send("Error inserting user in database");
          }
          return res.status(200).send("Applied to user successfully");
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { friendReq };
