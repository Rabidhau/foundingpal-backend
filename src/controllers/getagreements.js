const conn = require("../db/connection");

const get_agreement = async (req, res) => {
  const { userName, userRole } = req.query; // Use req.query, not req.params

  if (!userName || !userRole) {
    return res.status(400).json({ success: false, message: "Missing userName or userRole" });
  }

  try {
    // Determine the column to filter by based on the role
    const column = userRole === "Founder" ? "founderName" : "collaboratorName";

    const sql = `SELECT * FROM agreements WHERE ${column} = ?`;
    const values = [userName];

    conn.query(sql, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      console.log("Query Results:", results);

      if (results.length === 0) {
        console.log(`No agreements found for ${userRole}:`, userName);
        return res.status(404).json({ success: false, message: "No agreements found" });
      }

      res.status(200).json({ success: true, agreements: results });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { get_agreement };