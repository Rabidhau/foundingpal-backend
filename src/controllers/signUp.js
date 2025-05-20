const conn = require("../db/connection");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Function to hash a password using MD5
const md5Hash = (password) => {
  const hash = crypto.createHash("md5");
  hash.update(password);
  return hash.digest("hex");
};

const signUp = (req, res) => {
  const { fullName, email, password, selectedOption, token } = req.body;

  // Validate password
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password does not meet complexity requirements" });
  }

  // First: check if email exists
  const checkEmailSql = "SELECT email FROM Users WHERE email = ?";
  conn.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ success: false, message: "Database error", error: err.message });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "Email already exists in the system" });
    }

    // Second: check if username exists
    const checkUsernameSql = "SELECT username FROM Users WHERE username = ?";
    conn.query(checkUsernameSql, [fullName], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "Username already exists in the system" });
      }

      // If both email and username are unique, proceed to insert
      const userId = uuidv4();
      const hashedPassword = md5Hash(password);

      const insertUserSql = "INSERT INTO Users (userId, email, username, password, role, token) VALUES (?, ?, ?, ?, ?, ?)";
      const userValues = [userId, email, fullName, hashedPassword, selectedOption, token];

      conn.query(insertUserSql, userValues, (err) => {
        if (err) {
          console.error("Error inserting user:", err);
          return res.status(500).json({ success: false, message: "Error signing up" });
        }

        // Insert into role-specific table
        const roleSql = selectedOption === "Talent"
          ? "INSERT INTO talent_info (id, name, email) VALUES (?, ?, ?)"
          : "INSERT INTO founder_info (id, name, email) VALUES (?, ?, ?)";
        const roleValues = [userId, fullName, email];

        conn.query(roleSql, roleValues, (err) => {
          if (err) {
            console.error("Error inserting into role-specific table:", err);
            return res.status(500).json({ success: false, message: "Error signing up" });
          }

          return res.status(200).json({ success: true, message: "Signup successful" });
        });
      });
    });
  });
};
module.exports = { signUp, md5Hash };