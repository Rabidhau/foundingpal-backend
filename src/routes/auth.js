const express = require("express");
const router = express.Router();
const { logIn } = require("../controllers/logIn");
const { signUp } = require("../controllers/signUp");
const { verifyToken } = require("../controllers/sendtoken"); // Import the verifyToken function
const { verify } = require("../controllers/verify");
const { forgotPassword } = require("../controllers/forgotpass");


router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/authentication").post(verifyToken); // Add the new route
router.route("/verify-token").post(verify);
router.put("/forgot-password", forgotPassword);

module.exports = router;
