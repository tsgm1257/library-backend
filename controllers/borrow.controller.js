const express = require("express");
const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

const router = express.Router();

// Borrow a book
router.post("/:bookId", async (req, res) => {
  const { quantity, dueDate } = req.body;
  const { bookId } = req.params;

  if (!quantity || !dueDate) {
    return res.status(400).json({ error: "Quantity and dueDate are required" });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.copies < quantity) {
      return res.status(400).json({ error: "Not enough copies available" });
    }

    // Create borrow record
    const borrow = new Borrow({
      book: book._id,
      quantity,
      dueDate,
    });

    await borrow.save();

    // Update book's available copies
    book.copies -= quantity;
    if (book.copies === 0) book.available = false;
    await book.save();

    res.status(201).json({ message: "Book borrowed successfully" });
  } catch {
    res.status(500).json({ error: "Failed to borrow book" });
  }
});

// Get borrow summary (aggregate by book)
router.get("/summary", async (req, res) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalBorrowed: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          title: "$bookDetails.title",
          isbn: "$bookDetails.isbn",
          totalBorrowed: 1,
        },
      },
    ]);

    res.json(summary);
  } catch {
    res.status(500).json({ error: "Failed to fetch borrow summary" });
  }
});

module.exports = router;
