const express = require("express");
const router = express.Router();

const { upload: profileUpload, handleImageUpload } = require("../controllers/upload.js");
const { upload: signatureUpload, handleSignatureUpload } = require("../controllers/signature.js");

router.post("/upload", profileUpload.single("profileImage"), handleImageUpload);
router.post("/upload-signature", signatureUpload.single("signatureImage"), handleSignatureUpload);

module.exports = router;