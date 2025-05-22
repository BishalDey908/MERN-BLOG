const express = require("express");
const { userRegisterController, verifyOtpController, loginController } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/reg",userRegisterController);
router.post("/otp",verifyOtpController);
router.post("/login",loginController);

module.exports = router;