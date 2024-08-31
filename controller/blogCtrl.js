const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMondodbId = require("../utils/validateMongodbId");

//create a blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json({
      success: "true",
      data: { message: "Blog Create successfully" },
    });
  } catch (error) {
    res.status(400), json({ success: "false", data: { errMessage: error } });
    throw new Error("Invalid data");
  }
});

//get all blog
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    res.json({ success: "true", data: { allBlogs } });
  } catch (error) {
    res.status(400).json({ success: "false", data: { errMessage: error } });
    throw new Error("Invalid data");
  }
});

module.exports = { createBlog, getAllBlog };
