const express = require("express");
const router = express.Router();
const { createBlog, getAllBlog, getBlog } = require("../controller/blogCtrl");
const upload = require("../config/multerConfig");

router.post("/", upload.single("image"), createBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlog);

module.exports = router;
