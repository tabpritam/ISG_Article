const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

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

//get a blog
const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(req.params.id);
    res.json({ success: true, data: { blog } });
  } catch (error) {
    res.status(400).json({ success: false, data: { errMessage: error } });
    throw new Error("Invalid data");
  }
});

//update a blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ success: true, data: { message: "Blog updated successfully" } });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlog, getAllBlog, getBlog, updateBlog };
