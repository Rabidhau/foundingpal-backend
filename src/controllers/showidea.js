const conn = require("../db/connection");

const getIdeaById = async (req, res) => {
  const ideaId = req.params.id;

  try {
    const selectQuery = `
      SELECT 
        i.*, 
        u.*
      FROM idealisting i
      JOIN Users u ON i.userId = u.userId
      WHERE i.id = ?
    `;

    conn.query(selectQuery, [ideaId], (err, result) => {
      if (err) {
        console.error("Error fetching idea and founder info from db:", err);
        res.status(400).send("Error fetching idea and founder info from database");
      } else {
        if (result.length === 0) {
          res.status(404).send("Idea not found");
        } else {
          const ideaWithFounderInfo = result[0];
          console.log("Fetched idea with founder info:", ideaWithFounderInfo);
          res.status(200).send(ideaWithFounderInfo);
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error occurred while processing the request");
  }
};

module.exports = { getIdeaById };