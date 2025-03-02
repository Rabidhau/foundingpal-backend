const conn = require("../db/connection");

const getFriend = async (req, res) => {
  const { userId } = req.query;
  console.log("Received request for userId:", userId); // Log the incoming request

  try {
    // Step 1: Query to get the friendId associated with the userId
    const selectFriendQuery = "SELECT friendId FROM user_friends WHERE userId = ?";

    conn.query(selectFriendQuery, [userId], (selectFriendErr, selectFriendResult) => {
      if (selectFriendErr) {
        console.error("Error selecting friends from db:", selectFriendErr);
        return res.status(500).json({ error: "Error selecting user from database" });
      }

      console.log("Friend ID result from DB:", selectFriendResult);

      if (selectFriendResult.length === 0) {
        console.log("No friends found for this user.");
        return res.json([]); // Return empty array if no friends found
      }

      let existingFriendIds = [];

      try {
        existingFriendIds = JSON.parse(selectFriendResult[0].friendId); // Parse stored friendId array
        console.log("Parsed friend IDs:", existingFriendIds);

        if (!Array.isArray(existingFriendIds)) {
          throw new Error("Invalid friendId format");
        }
      } catch (error) {
        console.error("Error parsing friendId from DB:", error);
        return res.status(500).json({ error: "Database error: Invalid friendId format" });
      }

      // Fetch user information for each friendId from the users table
      const selectUserQuery = "SELECT userId, username,email,profile_image FROM Users WHERE userId IN (?)";
      console.log("Executing query to fetch user details:", selectUserQuery, existingFriendIds);

      conn.query(selectUserQuery, [existingFriendIds], (selectUserErr, selectUserResult) => {
        if (selectUserErr) {
          console.error("Error fetching user info from db:", selectUserErr);
          return res.status(500).json({ error: "Error fetching user information" });
        }

 

        // Convert RowDataPacket array to a plain array of objects
        const cleanResult = selectUserResult.map(row => ({ ...row }));
        console.log("Fetched friend information:", cleanResult);
        return res.json(cleanResult); // Return clean array
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getFriend };