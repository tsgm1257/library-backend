import { Router, Request, Response } from "express";
import Borrow from "../models/Borrow";
import Book from "../models/Book";

const router = Router();

// POST /api/borrows/:bookId
router.post("/borrows/:bookId", async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const { quantity, dueDate } = req.body;

    if (!quantity || !dueDate) {
      res.status(400).json({ error: "Quantity and due date are required" });
      return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (book.copies < quantity) {
      res.status(400).json({ error: "Not enough copies available" });
      return;
    }

    book.copies -= quantity;
    if (book.copies === 0) {
      book.available = false;
    }
    await book.save();

    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate,
    });

    const saved = await borrow.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Borrow error:", error);
    res.status(500).json({ error: "Failed to borrow book" });
  }
});

// GET /api/borrows/borrow-summary
router.get("/borrow-summary", async (_req: Request, res: Response) => {
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
          as: "bookInfo",
        },
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          _id: 0,
          title: "$bookInfo.title",
          isbn: "$bookInfo.isbn",
          totalBorrowed: 1,
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    console.error("Summary error:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
