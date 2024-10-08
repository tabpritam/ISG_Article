const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const image = req.file ? req.file.path : null; // Cloudinary URL

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
    const blog = await Blog.create({ title, content, author, image });

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

// get all blog
// const getAllBlog = asyncHandler(async (req, res) => {
//   try {
//     const allBlogs = await Blog.find();
//     res.json({ success: "true", data: { allBlogs } });
//   } catch (error) {
//     res.status(400).json({ success: "false", data: { errMessage: error } });
//     throw new Error("Invalid data");
//   }
// });
const getAllBlog = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 18;
    const skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();
    const allBlogs = await Blog.find().skip(skip).limit(limit);

    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      success: true,
      data: {
        allBlogs: allBlogs,
      },
      pageCount: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, data: { errMessage: error.message } });
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

//delete a blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    await Blog.findByIdAndDelete(id);
    res.json({ success: true, data: { message: "Blog deleted successfully" } });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = { createBlog, getAllBlog, getBlog, updateBlog, deleteBlog };
