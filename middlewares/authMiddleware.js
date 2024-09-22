const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);

        if (!user) {
          return res.status(401).json({
            success: false,
            error: { message: "Not authorized, user not found" },
          });
        }

        req.user = user;
        next();
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { message: "Not authorized, token expired, please login again" },
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: { message: "Token not found" },
    });
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });

  if (adminUser.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: { message: "Not authorized for this operation" },
    });
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
