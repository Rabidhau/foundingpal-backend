const conn = require("../db/connection");

const acceptedUsers = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // 🔹 Step 1: Get idea details from `idealisting` using userId
    const ideaQuery = `
      SELECT id, ideaTitle, ideaType, requirements, ideaInfo, equity
      FROM idealisting
      WHERE userId = ?
    `;

    conn.query(ideaQuery, [userId], (err, ideaResults) => {
      if (err) {
        console.error("❌ Error fetching ideas:", err);
        return res.status(500).json({ error: "Error fetching ideas" });
      }

      if (ideaResults.length === 0) {
        return res.status(404).json({ message: "No matching ideas found" });
      }

      // Extract idea IDs
      const ideaIDs = ideaResults.map(idea => idea.id);
      if (ideaIDs.length === 0) {
        return res.status(200).json([]); // Return empty array if no ideas found
      }

      // 🔹 Step 2: Get user_comment and completion_percent from `accepted_idea`
      const placeholders = ideaIDs.map(() => "?").join(",");
      const commentQuery = `
        SELECT ideaId, user_comment, completion_percent,status
        FROM accepted_idea
        WHERE ideaId IN (${placeholders})
      `;

      conn.query(commentQuery, ideaIDs, (err, commentResults) => {
        if (err) {
          console.error("❌ Error fetching comments:", err);
          return res.status(500).json({ error: "Error fetching comments" });
        }

        // Create a map to store comments & completion percent by ideaId
        const commentMap = new Map();
        commentResults.forEach(row => {
          commentMap.set(row.ideaId, {
            comment: row.user_comment,
            completion: row.completion_percent,
            acceptedStatus: row.status
          });
        });

        // Merge results from Step 1 and Step 2
        const finalResult = ideaResults.map(idea => ({
            ...idea,
            comment: commentMap.get(idea.id)?.comment || null,
            completion: commentMap.get(idea.id)?.completion || null,
            acceptedStatus: commentMap.get(idea.id)?.acceptedStatus || 0, // Ensure status is included
          }));
          

        // 🔹 Log final data before sending response
        console.log("✅ Final Data:", JSON.stringify(finalResult, null, 2));

        res.status(200).json(finalResult);
      });
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Error occurred while processing the request" });
  }
};

module.exports = { acceptedUsers };
