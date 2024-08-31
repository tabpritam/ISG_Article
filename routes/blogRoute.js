const express = require("express");
const router = express.Router();
const { createBlog, getAllBlog } = require("../controller/blogCtrl");

router.post("/", createBlog);
router.get("/", getAllBlog);

module.exports = router;
