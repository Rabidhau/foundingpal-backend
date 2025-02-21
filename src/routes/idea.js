const express = require("express");
const router = express.Router();

const { createIdea } = require("../controllers/createidea");
const { getAllIdea } = require("../controllers/showAllidea");
const { getIdeaById } = require("../controllers/showidea");
const { applyIdea } = require("../controllers/applyidea");
const { getActiveIdea } = require("../controllers/activeidea");
const {getArchiveIdea} = require("../controllers/archiveidea");
const {updateIdea} = require("../controllers/updateidea");
const {getTalent} = require("../controllers/gettalent");
const {insertTalent} = require("../controllers/updatetalent");
const {pendingIdea} = require("../controllers/pendingidea");
const {acceptedIdea} = require("../controllers/acceptedidea");
const {acceptedUsers} = require("../controllers/accepteduser");
const {commentIdea}= require("../controllers/commentidea");


router.route("/create-idea").post(createIdea);
router.route("/get-All-Idea").get(getAllIdea);
router.route("/show-idea/:id").get(getIdeaById);
router.route("/apply-idea").post(applyIdea);
router.route("/get-Active-Idea").get(getActiveIdea);
router.route("/get-Archive-Idea").get(getArchiveIdea);
router.route("/updateIdea/:id").put(updateIdea);
router.route("/get-talent/:id").get(getTalent);
router.route("/update-talent-status").post(insertTalent);
router.route("/get-pending-Idea").get(pendingIdea);
router.route("/get-accepted-Idea").get(acceptedIdea);
router.route("/get-accepted-Users").get(acceptedUsers);
router.route("/comment-idea").put(commentIdea);

module.exports = router;
