const conn = require("../db/connection");

const insertTalent = (req, res) => {
  const { ideaId, talentId, status, rejectionReason } = req.body;

  console.log(ideaId, talentId, status, rejectionReason);

  if (!ideaId || !talentId || status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // SQL query to insert into accepted_idea
  const insertQuery = `
    INSERT IGNORE INTO accepted_idea (ideaId, talentId, status, rejection_reason) VALUES (?, ?, ?, ?)`;

  // SQL query to update talent_info status
  const updateQuery = `
    UPDATE talent_info SET status = ? WHERE id = ?`;

  // Execute both queries inside a transaction
  conn.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Insert into accepted_idea
    conn.query(
      insertQuery,
      [ideaId, talentId, status, rejectionReason || null], // Pass rejectionReason (or null if not provided)
      (err, result) => {
        if (err) {
          return conn.rollback(() => {
            console.error("Error inserting into accepted_idea:", err);
            res.status(500).json({ error: "Internal Server Error" });
          });
        }

        if (result.affectedRows === 0) {
          return conn.rollback(() => {
            res.status(409).json({ message: "Duplicate entry ignored" });
          });
        }

        // Update status in talent_info
        conn.query(updateQuery, [status, talentId], (err, updateResult) => {
          if (err) {
            return conn.rollback(() => {
              console.error("Error updating talent_info:", err);
              res.status(500).json({ error: "Internal Server Error" });
            });
          }

          // Commit transaction if both queries succeed
          conn.commit((err) => {
            if (err) {
              return conn.rollback(() => {
                console.error("Transaction commit error:", err);
                res.status(500).json({ error: "Internal Server Error" });
              });
            }

            res.status(200).json({
              message: "Talent inserted and status updated successfully",
              id: result.insertId,
            });
          });
        });
      }
    );
  });
};

module.exports = { insertTalent };