const conn = require("../db/connection");

const getAllcontracts = async (req, res) => {
  try {
    const { query } = req.query;

    let selectQuery = "SELECT * FROM agreements";
    let queryParams = [];

    if (query) {
      selectQuery += " WHERE projectTitle LIKE ? OR founderName LIKE ?";
      queryParams.push(`%${query}%`, `%${query}%`);
    }

    conn.query(selectQuery, queryParams, (err, result) => {
      if (err) {
        console.error("Error fetching agreements from db:", err);
        return res.status(500).json({ error: "Error fetching agreements from database" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "No agreements found" });
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while processing the request" });
  }
};

module.exports = { getAllcontracts };