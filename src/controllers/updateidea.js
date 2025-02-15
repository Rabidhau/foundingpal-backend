const conn = require("../db/connection");

const updateIdea = (req, res) => {
  const ideaId = req.params.id; // Get idea ID from URL params
  const {
    ideaTitle,
    ideaInfo,
    ideaType,
    ideaStage,
    requirement,
    equity,
    status,
  } = req.body;

  // Ensure all required fields are present
  if (!ideaTitle || !ideaInfo || !ideaType || !ideaStage || !requirement || !equity || status === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // SQL Query
  const updateQuery = `
    UPDATE idealisting 
    SET ideaTitle = ?, ideaInfo = ?, ideaType = ?, ideaStage = ?, requirements = ?, equity = ?, status = ?
    WHERE id = ?`;

  const values = [
    ideaTitle,
    ideaInfo,
    ideaType,
    ideaStage,
    requirement,
    equity,
    status,
    ideaId,
  ];

  // Execute query using callback
  conn.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("Error updating idea:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the idea was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    // Success response
    res.status(200).json({ message: "Idea updated successfully" });
  });
};

module.exports = { updateIdea };
