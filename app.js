const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
const multer = require("multer");
const upload = multer();
const blogRouter = require("./routes/blogRoute");
const authRouter = require("./routes/authRoute");

dbConnect();
const corsOptions = {
  origin: [
    "http://localhost:5000", // Allow from local machine
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Adjust headers if needed
  credentials: true, // If you're using cookies or authorization headers
};
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(upload.none()); // This should come before your routes
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API! ",
    status: "success",
    data: null,
  });
});

app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
