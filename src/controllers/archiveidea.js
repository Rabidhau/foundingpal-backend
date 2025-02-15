const conn = require("../db/connection");

const getArchiveIdea = async (req, res) => {
  try {
    // Extracting search query & userId from request query params
    const { query, userId } = req.query;

    let selectQuery = "SELECT * FROM idealisting WHERE status = 0";
    let queryParams = [];


      selectQuery += " AND userId = ?";
      queryParams.push(userId);


    // If a search query exists, add conditions safely using placeholders
    if (query) {
      selectQuery += " AND (ideaTitle LIKE ? OR ideaType LIKE ?)";
      const searchPattern = `%${query}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // Execute the query safely
    conn.query(selectQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error fetching ideas from db:", err);
        return res.status(500).json({ error: "Error fetching ideas from database" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No archived ideas found" });
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { getArchiveIdea };
