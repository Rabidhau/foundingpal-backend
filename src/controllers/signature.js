const multer = require("multer");
const fs = require("fs");
const path = require("path");
const conn = require("../db/connection"); // MySQL connection file

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../public/signature");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Function to handle signature upload and database update
const handleSignatureUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const imageUrl = `/signature/${req.file.filename}`; // Adjusted path
  const { userName, userRole, agreementId } = req.body; // Get agreementId

  if (!userName || !userRole || !agreementId) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  let query;
  let params;

  if (userRole === "Founder") {
    query = "UPDATE agreements SET founderSignature = ? WHERE id = ? AND founderName = ?";
    params = [imageUrl, agreementId, userName];
  } else if (userRole === "Talent") {
    query = "UPDATE agreements SET collaboratorSignature = ? WHERE id = ? AND collaboratorName = ?";
    params = [imageUrl, agreementId, userName];
  } else {
    return res.status(400).json({ success: false, message: "Invalid user role" });
  }

  // Save image URL to MySQL database
  conn.query(query, params, (err, result) => {
    if (err) {
      console.error("Error updating signature:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "No matching agreement found" });
    }

    res.status(200).json({ success: true, message: "Signature uploaded successfully", imageUrl });
  });
};

module.exports = { upload, handleSignatureUpload };