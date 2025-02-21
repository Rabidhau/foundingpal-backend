const conn = require("../db/connection");

const commentIdea = (req, res) => { 
  const { ideaId, comment, completionPercent } = req.body;

  if (!ideaId || completionPercent === undefined || !comment) {
    return res.status(400).json({ error: "All fields (ideaId, comment, completionPercent) are required" });
  }

  // SQL Query
  const updateQuery = `
    UPDATE accepted_idea 
    SET user_comment = ?, completion_percent = ?
    WHERE ideaId = ?`; // ✅ Ensure we're using the correct column

  const values = [comment, completionPercent, ideaId];

  // Execute query
  conn.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("❌ Error updating idea:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any row was actually updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Idea not found or already up-to-date" });
    }

    res.status(200).json({ message: "✅ Idea updated successfully" });
  });
};

module.exports = { commentIdea };
