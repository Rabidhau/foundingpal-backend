const conn = require("../db/connection");

const applyIdea = async (req, res) => {
  const { talentId, ideaId } = req.body;

  try {
    // Check if the ideaId already exists in applied_idea
    const selectQuery = "SELECT talentId FROM applied_idea WHERE ideaId = ?";
    
    conn.query(selectQuery, [ideaId], (selectErr, selectResult) => {
      if (selectErr) {
        console.error("Error selecting idea from db:", selectErr);
        return res.status(400).send("Error selecting idea from database");
      }

      if (selectResult.length > 0) {
        let existingTalentIds;
        try {
          existingTalentIds = JSON.parse(selectResult[0].talentId);
        } catch (error) {
          console.error("Error parsing talentId from DB:", error);
          return res.status(500).send("Database error: Invalid talentId format");
        }

        if (existingTalentIds.includes(talentId)) {
          // If talentId already exists for the ideaId, return an error
          return res.status(400).send("Talent already applied for this idea");
        }

        // Add the new talentId to the existing array
        existingTalentIds.push(talentId);
        const updatedTalentIds = JSON.stringify(existingTalentIds);

        // Update the record with the new talentId array
        const updateQuery = "UPDATE applied_idea SET talentId = ? WHERE ideaId = ?";
        conn.query(updateQuery, [updatedTalentIds, ideaId], (updateErr) => {
          if (updateErr) {
            console.error("Error updating idea in db:", updateErr);
            return res.status(400).send("Error updating idea in database");
          }
          return res.status(200).send("Applied to idea successfully");
        });
      } else {
        // If no record exists, create a new one with the talentId
        const newTalentIds = JSON.stringify([talentId]);
        const insertQuery = "INSERT INTO applied_idea (ideaId, talentId) VALUES (?, ?)";
        conn.query(insertQuery, [ideaId, newTalentIds], (insertErr) => {
          if (insertErr) {
            console.error("Error inserting idea in db:", insertErr);
            return res.status(400).send("Error inserting idea in database");
          }
          return res.status(200).send("Applied to idea successfully");
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { applyIdea };
