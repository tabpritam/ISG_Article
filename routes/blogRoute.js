const express = require("express");
const router = express.Router();
const { createBlog, getAllBlog, getBlog } = require("../controller/blogCtrl");
const upload = require("../config/multerConfig");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.post("/", upload.single("image"), authMiddleware, isAdmin, createBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlog);

module.exports = router;
