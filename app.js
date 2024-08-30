const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const morgan = require("morgan");
dbConnect();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API! vercel deploy test",
    status: "success",
    data: null,
  });
});
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
