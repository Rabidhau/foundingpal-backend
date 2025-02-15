require('dotenv').config();
const nodemailer = require("nodemailer");
const conn = require("../db/connection");

const emailSender = process.env.EMAIL_SENDER;
const emailPassword = process.env.EMAIL_PASSWORD;


let storedToken = null;

const checkToken = async (token) => {
  if (storedToken && storedToken.toString() === token.toString()) {
    return true;
  } 
  return false;
};

const sendTokenByEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailSender,
      pass: emailPassword,
    },
  });

  const mailOptions = {
    from: emailSender,
    to: email,
    subject: "Signup Token",
    text: `Your signup token is: ${token}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const verify = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");

  }

  try {
    storedToken = Math.floor(100000 + Math.random() * 900000);
    await sendTokenByEmail(email, storedToken);
    res.status(200).send("Token sent successfully");
  } catch (error) {
    console.error("Error sending token:", error);
    res.status(500).send("Error sending token");
  }
};

module.exports = { verify, checkToken };