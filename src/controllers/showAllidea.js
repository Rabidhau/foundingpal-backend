const conn = require("../db/connection");

const getAllIdea = async (req, res) => {
  try {
    // Extracting search query from request query parameters
    const { query } = req.query;

    let selectQuery = "SELECT * FROM idealisting WHERE status = 1";

    // If there's a search query, apply it within the correct condition
    if (query) {
      selectQuery += ` AND (ideaTitle LIKE '%${query}%' OR ideaType LIKE '%${query}%')`;
    }

    conn.query(selectQuery, (err, result) => {
      if (err) {
        console.error("Error fetching job from db:", err);
        res.status(400).send("Error fetching job from database");
      } else {
        if (result.length === 0) {
          res.status(404).send("Job not found");
        } else {
          res.status(200).send(result);
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error occurred while processing the request");
  }
};

module.exports = { getAllIdea };
