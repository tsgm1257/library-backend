const express = require("express");
const Book = require("../models/Book");

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get single book
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// Create a new book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ error: "Failed to create book" });
  }
});

// Update a book
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Book not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Failed to update book" });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch {
    res.status(400).json({ error: "Failed to delete book" });
  }
});

module.exports = router;
