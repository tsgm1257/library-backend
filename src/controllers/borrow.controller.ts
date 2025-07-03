import { Router, Request, Response } from "express";
import Borrow from "../models/Borrow";
import Book from "../models/Book";

const router = Router();

// POST /api/borrows/:bookId
router.post("/:bookId", async (req: Request, res: Response) => {
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
  } catch {
    res.status(500).json({ error: "Failed to borrow book" });
  }
});

// GET /api/borrows/summary
router.get("/summary", async (_req: Request, res: Response) => {
  try {
    const borrows = await Borrow.find().populate("book");

    const summary = borrows.map((borrow) => ({
      id: borrow._id,
      bookTitle: (borrow.book as any)?.title || "Unknown",
      quantity: borrow.quantity,
      dueDate: borrow.dueDate,
      createdAt: borrow.createdAt,
    }));

    res.json(summary);
  } catch {
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

export default router;
