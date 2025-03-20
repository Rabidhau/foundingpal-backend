const db = require("../db/connection");
const crypto = require("crypto");

// Function to hash a password using MD5
const md5Hash = (password) => {
  const hash = crypto.createHash("md5");
  hash.update(password);
  return hash.digest("hex");
};

exports.forgotPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  // Validate input
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "Email, token, and new password are required." });
  }

  // Validate password complexity
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({ error: "Password does not meet complexity requirements." });
  }

  try {
    // Step 1: Find the user with the provided email and token
    const result = await db.query(
        "SELECT * FROM Users WHERE email = ? AND token = ?",
        [email, token]
      );

      // Check if the user exists
      if (result.length === 0) {
        return res.status(404).json({ error: "Invalid email or token." });
      }
    // Step 2: Hash the new password using md5
    const hashedPassword = md5Hash(newPassword); // Use the correct function name

    // Step 3: Update the user's password and clear the reset token
    await db.query(
      "UPDATE Users SET password = ? WHERE email = ? AND token = ?",
      [hashedPassword, email, token]
    );

    // Step 4: Send a success response
    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Failed to update password. Please try again." });
  }
};