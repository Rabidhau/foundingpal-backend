const conn = require("../db/connection");

const getAllusers = async (req, res) => {
  try {
    // Extract search query and userId from request
    const { query } = req.query;
    const userId = req.headers.userid; // Get userId from request headers

    if (!userId) {
      return res.status(400).send("User ID is required in headers");
    }

    // Base query with parameterized exclusions
    let selectQuery = "SELECT * FROM users WHERE userId NOT IN (?, ?)";
    let queryParams = [userId, "71ebcbb4-018b-4962-bee8-1330f70ee9f4"];

    // If there's a search query, apply filters safely
    if (query) {
      selectQuery += " AND (username LIKE ? OR role LIKE ?)";
      queryParams.push(`%${query}%`, `%${query}%`);
    }

    conn.query(selectQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error fetching users from db:", err);
        return res.status(500).send("Error fetching users from database");
      }

      if (result.length === 0) {
        return res.status(404).send("No users found");
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred while processing the request");
  }
};

module.exports = { getAllusers };