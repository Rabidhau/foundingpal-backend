const conn = require("../db/connection");
const { md5Hash } = require("./signUp");

const logIn = async (req, res) => {
  const { email, password } = req.body;

try {
  const hashedPassword = md5Hash(password);

  const sql = "SELECT userId, email, username, role,profile_image FROM Users WHERE email=? AND password=?";
  const values = [email, hashedPassword];

  conn.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error logging in:", err);
      res.status(500).send("Error logging in");
    } else if (result.length === 0) {
      res.status(401).send("Invalid email or password");
    } else {
      const userData = result[0];
      res.status(200).json(userData); // Send user data if login successful
    }
  });
} catch (error) {
  console.error("Error hashing password:", error);
  res.status(500).send("Error logging in");
}
};

module.exports = { logIn };
