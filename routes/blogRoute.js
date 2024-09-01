const express = require("express");
const router = express.Router();
const { createBlog, getAllBlog, getBlog } = require("../controller/blogCtrl");

router.post("/", createBlog);
router.get("/", getAllBlog);
router.get("/:id", getBlog);

module.exports = router;
