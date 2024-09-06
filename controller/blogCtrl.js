const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, author } = req.body;

    let missingFields = [];
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");
    if (!author) missingFields.push("author");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: `${missingFields.join(", ")} is required`,
        },
      });
    }

    // Create the blog
    const blog = await Blog.create({ title, content, author });
    res.status(201).json({
      success: true,
      data: {
        message: "Blog created successfully",
        blog,
      },
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: {
          message: messages.join(", "),
        },
      });
    }

    // Handle other errors
    console.error(error); // Log the error for internal review
    res.status(500).json({
      success: false,
      error: {
        message: "An internal server error occurred. Please try again later.",
      },
    });
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
