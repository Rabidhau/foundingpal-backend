const conn = require("../db/connection");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Function to hash a password using MD5
const md5Hash = (password) => {
  const hash = crypto.createHash("md5");
  hash.update(password);
  return hash.digest("hex");
};

const signUp = async (req, res) => {
  const { fullName, email, password, selectedOption, token } = req.body;

  try {
    // Validate password using regex
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send("Password does not meet complexity requirements");
    }

    // Generate userId using uuidv4
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = md5Hash(password);

    const sqlUser = "INSERT INTO Users (userId, email, username, password, role,token) VALUES (?, ?, ?, ?, ?, ?)";
    const valuesUser = [userId, email, fullName, hashedPassword, selectedOption,token];

    // Execute query to insert user into Users table
    await conn.query(sqlUser, valuesUser);

    // If the role is talent, insert user info into talent_info table
    if (selectedOption === "Talent") {
      const sqltalent = "INSERT INTO talent_info (id, name, email) VALUES (?, ?, ?)";
      const valuestalent = [userId, fullName, email];
      await conn.query(sqltalent, valuestalent);
    }
    if (selectedOption === "Founder") {
      const sqlFounder = "INSERT INTO founder_info (id, name, email) VALUES (?, ?, ?)";
      const valuesFounder = [userId, fullName, email];
      await conn.query(sqlFounder, valuesFounder);
    }
    console.log("Signup successful");
    return res.status(200).send("Signup successful");
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(500).send("Error signing up");
  }
};

module.exports = { signUp, md5Hash };
