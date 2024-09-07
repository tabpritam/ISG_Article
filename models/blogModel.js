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
    description: {
      type: String,
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

blogSchema.pre("save", function (next) {
  if (this.content) {
    // First, replace all closing tags with a space
    let plainTextContent = this.content.replace(/<\/[^>]+>/g, " ");

    // Then, remove all remaining tags (opening tags)
    plainTextContent = plainTextContent.replace(/<[^>]+>/g, "");

    // Slice the plain text to the first 500 characters
    this.description =
      plainTextContent.length > 500
        ? plainTextContent.slice(0, 500)
        : plainTextContent;
  }

  next();
});

module.exports = mongoose.model("Blog", blogSchema);
