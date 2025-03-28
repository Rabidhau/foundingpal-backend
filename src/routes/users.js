const express = require("express");
const router = express.Router();

const { getAllusers } = require("../controllers/getusers");
const { friendReq } = require("../controllers/friendreq");
const { checkFriendStatus } = require("../controllers/check_friend");
const { getFriend } = require("../controllers/getfriend");
const { getprofileById } = require("../controllers/profile");
const { updateProfile } = require("../controllers/updateprofile");

router.route("/get-All-User").get(getAllusers);
router.route("/check-friend-status").get(checkFriendStatus);
router.route("/get-friend").get(getFriend);
router.route("/send-req").post(friendReq);
router.route("/get-profile").get(getprofileById);
router.route("/update-profile").put(updateProfile);

module.exports = router;