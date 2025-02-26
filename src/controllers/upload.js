const multer = require("multer");
const fs = require("fs");
const path = require("path");
const conn = require("../db/connection"); // MySQL connection file

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../public/uploads");
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

// Function to handle image upload and database update
const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`; // Adjusted path
  const userId = req.body.userId; // Get userId from request body

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Save image URL to MySQL database
  const query = "UPDATE Users SET profile_image = ? WHERE userId = ?";
  conn.query(query, [imageUrl, userId], (err, result) => {
    if (err) {
      console.error("Error updating profile image:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "Profile image updated successfully", imageUrl });
  });
};

module.exports = { upload, handleImageUpload };