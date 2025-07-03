const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://client-gamma-woad.vercel.app"], // Include protocol!
  })
);
app.use(express.json());

// Routes
app.use("/api/books", require("../controllers/book.controller"));
app.use("/api/borrows", require("../controllers/borrow.controller"));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Library Management API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export as serverless function
module.exports = serverless(app);
