// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bookController from "./controllers/book.controller";
import borrowController from "./controllers/borrow.controller";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["https://client-gamma-woad.vercel.app"],
  })
);
app.use(express.json()); // ← JSON parser must come before your routes

// Connect to DB
connectDB();

// Routes
app.use("/api/books", bookController);
app.use("/api/borrows", borrowController);

app.get("/", (_req, res) => {
  res.send("Library Management API is running...");
});

export default app;
