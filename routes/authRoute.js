// routes/authRoute.js
const express = require("express");
const { signup, verifyOtp, resendOtp,login } = require("../controller/authCtrl");
const rateLimit = require("express-rate-limit");
const asyncHandler = require("express-async-handler");


const router = express.Router();

// Rate limiter for signup and OTP routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: "Too many requests, please try again later.",
});

router.use(authLimiter);

// Signup route
router.post("/signup", signup);

// OTP verification route
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", login);
module.exports = router;
