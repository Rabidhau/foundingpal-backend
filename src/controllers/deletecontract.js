const db = require("../db/connection"); // Assuming you're using MySQL

exports.deleteContract = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM agreements WHERE id = ?", [id]);
    res.status(200).json({ message: "Contract deleted successfully" });
  } catch (error) {
    console.error("Error deleting contract:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};