const conn = require("../db/connection"); // Ensure the correct path to your DB connection
const util = require("util"); // Allows promisifying the database query

const verifyToken = async (req, res) => {
  const { token, id } = req.body;

  if (!token || !id) {
    return res.status(400).json({ error: "Token and user ID are required" });
  }

  try {
    const query = util.promisify(conn.query).bind(conn);
    const sql = "SELECT token FROM Users WHERE userId=?";
    const result = await query(sql, [id]); // Await the query execution

    if (result.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const storedToken = result[0].token; // Get the token from the DB

    if (storedToken !== token) {
      return res.status(401).json({ error: "Invalid token" });
    }

    res.status(200).json({ message: "Token verified successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { verifyToken };
