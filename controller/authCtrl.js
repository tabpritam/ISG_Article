const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const Joi = require("joi");
const { isValidEmail, isValidMobileNumber } = require("../utils/validators");

// Validation schemas
const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  mobileNumber: Joi.string().optional(),
  role: Joi.string().valid("user", "admin").optional(),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// User signup controller
const signup = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const { error } = signupSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: { message: error.details[0].message } });

    const { firstName, lastName, email, password, mobileNumber, role } =
      req.body;

    // Validate email
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ success: false, error: { message: "Enter a valid email" } });
    }

    // Validate mobile number
    if (mobileNumber && !isValidMobileNumber(mobileNumber)) {
      return res.status(400).json({
        success: false,
        error: { message: "Enter a valid mobile number" },
      });
    }

    let user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ success: false, error: { message: "User already exists" } });

    const hashedPassword = await bcrypt.hash(password, 12);

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    const hashedOtp = await bcrypt.hash(otp, 12);

    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      mobileNumber,
      role,
      otp: hashedOtp,
      otpExpires,
    });

    await user.save();

    await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);

    res.status(201).json({
      success: true,
      data: {
        message: "Otp sent to your email",
      },
    });
  } catch (error) {
    console.error(error); // Log error for internal review
    res.status(500).json({
      success: false,
      error: {
        message: "An internal server error occurred. Please try again later.",
      },
    });
  }
});

// OTP verification controller
const verifyOtp = asyncHandler(async (req, res) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: { message: error.details[0].message } });

    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(400)
        .json({ success: false, error: { message: "Invalid user" } });

    // Check OTP validity
    const otpValid = await bcrypt.compare(otp, user.otp);
    if (!otpValid || user.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        error: { message: "OTP is invalid or expired" },
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      data: { message: "User verified successfully", token },
    });
  } catch (error) {
    console.error(error); // Log error for internal review
    res.status(500).json({
      success: false,
      error: {
        message: "An internal server error occurred. Please try again later.",
      },
    });
  }
});

//resent otp
const resendOtp = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, error: { message: "User does not exist" } });

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Hash the new OTP before storing
    const hashedOtp = await bcrypt.hash(otp, 12);

    // Update user with new OTP and expiration time
    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send the new OTP via email
    await sendEmail(email, "Resend OTP", `Your new OTP is: ${otp}`);

    res
      .status(200)
      .json({ success: true, data: { message: "New OTP sent to your email" } });
  } catch (error) {
    console.error(error); // Log error for internal review
    res.status(500).json({
      success: false,
      error: {
        message: "An internal server error occurred. Please try again later.",
      },
    });
  }
});

module.exports = { signup, verifyOtp, resendOtp };
