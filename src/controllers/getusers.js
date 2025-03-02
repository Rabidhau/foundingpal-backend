const conn = require("../db/connection");

const getAllusers = async (req, res) => {
  try {
    // Extracting search query and userId from request
    const { query } = req.query;
    const userId = req.headers.userid; // Get userId from request headers

    let selectQuery = "SELECT * FROM users WHERE userId != ?"; // Exclude current user

    // If there's a search query, apply filters
    if (query) {
      selectQuery += ` AND (username LIKE '%${query}%' OR role LIKE '%${query}%')`;
    }

    conn.query(selectQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching users from db:", err);
        return res.status(400).send("Error fetching users from database");
      }

      if (result.length === 0) {
        return res.status(404).send("Users not found");
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error occurred while processing the request");
  }
};

module.exports = { getAllusers };