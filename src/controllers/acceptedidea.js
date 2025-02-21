const conn = require("../db/connection");

const acceptedIdea = async (req, res) => {
  try {
    const { query, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Step 1: Get applied idea IDs & their status for the given user
    const appliedQuery = "SELECT ideaId, status,rejection_reason,user_comment,completion_percent FROM accepted_idea WHERE talentId=?";
    conn.query(appliedQuery, [userId], (err, appliedResults) => {
      if (err) {
        console.error("❌ Error fetching applied ideas:", err);
        return res.status(500).json({ error: "Error fetching applied ideas" });
      }

      if (appliedResults.length === 0) {
        return res.status(404).json({ message: "No applied ideas found" });
      }

      // Extract idea IDs and store statuses in a map
      const ideaStatusMap = new Map();
      const ideaIDs = appliedResults.map(row => {
        ideaStatusMap.set(row.ideaId, row.status); // Store status for each ideaId
        return row.ideaId;
      });
      const ideareasonMap = new Map();
      appliedResults.forEach(row => {
        ideareasonMap.set(row.ideaId, row.rejection_reason); // ✅ Corrected
      });
      const ideacommentMap = new Map();
      appliedResults.forEach(row => {
        ideacommentMap.set(row.ideaId, row.user_comment); // ✅ Corrected
      });
      const ideacompletionMap = new Map();
      appliedResults.forEach(row => {
        ideacompletionMap.set(row.ideaId, row.completion_percent); // ✅ Corrected
      });
      

      // 🔴 Handle empty ideaIDs case
      if (ideaIDs.length === 0) {
        return res.status(404).json({ message: "No matching ideas found" });
      }

      // 🔥 Dynamically construct the placeholders for IN clause
      const placeholders = ideaIDs.map(() => "?").join(",");

      // 🔹 Step 2: Get idea details from idealisting
      let selectQuery = `
        SELECT 
          il.id, 
          il.ideaTitle, 
          il.ideaStage, 
          il.requirements, 
          il.ideaType, 
          il.ideaInfo, 
          il.equity
        FROM idealisting il
        WHERE il.id IN (${placeholders})
      `;

      let queryParams = [...ideaIDs];

      // 🔹 Step 3: Apply search filter if query exists
      if (query) {
        selectQuery += " AND (il.ideaTitle LIKE ? OR il.ideaType LIKE ?)";
        const searchPattern = `%${query}%`;
        queryParams.push(searchPattern, searchPattern);
      }

      conn.query(selectQuery, queryParams, (err, result) => {
        if (err) {
          console.error("❌ Error fetching ideas:", err);
          return res.status(500).json({ error: "Error fetching ideas from database" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No matching ideas found" });
        }

        // 🔹 Step 4: Attach the status from Step 1 to the final result
        const finalResult = result.map(idea => ({
          ...idea,
          acceptedStatus: ideaStatusMap.get(idea.id),
          reason: ideareasonMap.get(idea.id), // ✅ Now correctly fetching reason
          comment: ideacommentMap.get(idea.id),
          completion: ideacompletionMap.get(idea.id),
          
        }));
        res.status(200).json(finalResult);
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { acceptedIdea };
