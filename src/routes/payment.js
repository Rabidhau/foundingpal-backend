const express = require("express");
const router = express.Router();
const { Payment } = require("../controllers/payment");
const {verifyEsewaPayment} = require("../controllers/verifypayment");
const {agreements}=require("../controllers/agreements")


router.route("/payment").post(Payment);
router.route("/verify-payment").post(verifyEsewaPayment);
router.route("/agreements").post(agreements);


module.exports = router;