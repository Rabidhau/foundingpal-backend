const express = require("express");
const router = express.Router();

const { upload, handleImageUpload } = require("../controllers/upload.js");


router.post("/upload", upload.single("profileImage"), handleImageUpload);

module.exports = router;