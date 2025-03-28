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
      return res.status(404).json({ error: "No talents found for this idea" });
    }

    // Parse talentIDs properly
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

    // Fetch talent details along with status from accepted_ideas
    const talentQuery = `
      SELECT 
        t.id, 
        t.name, 
        t.email,
        t.bio,
        t.qualification, 
        COALESCE(a.status, NULL) AS status
      FROM talent_info t
      LEFT JOIN accepted_idea a ON t.id = a.talentId AND a.ideaId = ?
      WHERE t.id IN (?)`;

    const talentDetails = await query(talentQuery, [ideaId, talentIDs]);

    res.status(200).json({ talents: talentDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { getTalent };
