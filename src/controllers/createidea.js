const { v4: uuidv4 } = require("uuid");
const conn = require("../db/connection");

const createIdea = async (req, res) => {
  try {
    const {
      userId,
      ideaTitle,
      ideaInfo,
      ideaType,
      ideaStage,
      requirement,
      equity,
      status = false, // Default status to false if not provided
    } = req.body;

    // Validate required fields
    if (!userId || !ideaTitle || !ideaInfo || !ideaType || !ideaStage) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate unique idea ID
    const ideaId = uuidv4();

    // SQL Query
    const insertQuery = `
      INSERT INTO idealisting 
      (userId, id, ideaTitle, ideaInfo, ideaType, ideaStage, requirements, equity, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      userId,
      ideaId,
      ideaTitle,
      ideaInfo,
      ideaType,
      ideaStage,
      requirement,
      equity,
      status,
    ];

    // Execute query using Promises
    await conn.query(insertQuery, values);

    // Success response
    res.status(201).json({ message: "Idea created successfully", ideaId });

  } catch (error) {
    console.error("Error inserting idea:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createIdea };
