const conn = require("../db/connection");

// Helper function to promisify conn.query
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const getTalent = async (req, res) => {
  const ideaId = req.params.id; // Get ideaId from request parameters

  if (!ideaId) {
    return res.status(400).json({ error: "Idea ID is required" });
  }

  try {
    // Fetch talent IDs associated with the idea
    const selectQuery = "SELECT talentID FROM applied_idea WHERE ideaID = ?";
    const appliedTalents = await query(selectQuery, [ideaId]);

    if (!appliedTalents || appliedTalents.length === 0) {
      return res.status(404).json({ error: "Idea not found" });
    }

    // Parse talentIDs properly (handling stringified arrays)
    let talentIDs = appliedTalents.map(row => {
      try {
        return JSON.parse(row.talentID); // Parse JSON string
      } catch (err) {
        return row.talentID; // If parsing fails, return as is
      }
    }).flat(); // Flatten in case of nested arrays

    if (talentIDs.length === 0) {
      return res.status(200).json({ talents: [] });
    }

    // Fetch talent details (name and email) from talent_info table
    const talentQuery = "SELECT name, email FROM talent_info WHERE id IN (?)";
    const talentDetails = await query(talentQuery, [talentIDs]);

    res.status(200).json({ talents: talentDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { getTalent };