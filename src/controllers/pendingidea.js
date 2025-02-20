const conn = require("../db/connection");

const pendingIdea = async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Step 1: Get applied idea IDs for the given user (Use JSON_CONTAINS here)
    const appliedQuery = "SELECT ideaID FROM applied_idea WHERE JSON_CONTAINS(talentID, ?)";
    conn.query(appliedQuery, [`"${userId}"`], (err, appliedResults) => {
      if (err) {
        console.error("Error fetching applied ideas:", err);
        return res.status(500).json({ error: "Error fetching applied ideas" });
      }

      if (appliedResults.length === 0) {
        return res.status(404).json({ message: "No applied ideas found" });
      }

      // Extract idea IDs
      const ideaIDs = appliedResults.map(row => row.ideaID);

      // 🔴 Handle empty ideaIDs case
      if (ideaIDs.length === 0) {
        return res.status(404).json({ message: "No matching ideas found" });
      }

      // 🔥 Dynamically construct the placeholders for IN clause
      const placeholders = ideaIDs.map(() => "?").join(",");

      // Step 2: Get idea details from idealisting & status from accepted_idea
      let selectQuery = `
      SELECT 
        il.id, 
        il.ideaTitle, 
        il.ideaStage, 
        il.requirements, 
        il.ideaType, 
        il.ideaInfo, 
        il.equity, 
        COALESCE(ai.status, -1) AS status  -- Handle NULLs in status
      FROM idealisting il
      LEFT JOIN accepted_idea ai 
        ON il.id = ai.ideaId 
        AND ai.talentId = ?  -- Direct match as accepted_idea.talentId is NOT JSON
      WHERE il.id IN (${placeholders})
      `;

      let queryParams = [userId, ...ideaIDs]; // Use normal userId (no JSON format)

      // Step 3: Apply search filter if query exists
      if (query) {
        selectQuery += " AND (il.ideaTitle LIKE ? OR il.ideaType LIKE ?)";
        const searchPattern = `%${query}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      conn.query(selectQuery, queryParams, (err, result) => {
        if (err) {
          console.error("Error fetching ideas:", err);
          return res.status(500).json({ error: "Error fetching ideas from database" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No matching ideas found" });
        }
        
        console.log("✅ Final Data:", JSON.stringify(result, null, 2));
        res.status(200).json(result);
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { pendingIdea };
