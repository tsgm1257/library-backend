// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import bookController from "./controllers/book.controller";
import borrowController from "./controllers/borrow.controller";

dotenv.config();

const app = express();

// ✅ CORS before anything else
app.use(
  cors({
    origin: ["http://localhost:5173", "https://client-gamma-woad.vercel.app"],
  })
);

// ✅ JSON parser
app.use(express.json());

// ✅ Connect to DB
connectDB();

// ✅ Routes
app.use("/api/books", bookController);
app.use("/api", borrowController);

app.get("/", (_req, res) => {
  res.send("Library Management API is running...");
});

export default app;
