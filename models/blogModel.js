const mongoose = require("mongoose");

var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    image: {
      type: String,
    },
  },
  {
    toJSON: {
      virtuals: false,
    },
    toObject: {
      virtuals: false,
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
