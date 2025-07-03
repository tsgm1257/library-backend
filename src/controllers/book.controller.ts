import express, { Request, Response } from "express";
import Book from "../models/Book";

const router = express.Router();

// Get all books with pagination
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      Book.find().skip(skip).limit(limit),
      Book.countDocuments(),
    ]);

    res.json({
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// Get single book by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json(book);
  } catch {
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// Create a new book
router.post("/", async (req: Request, res: Response) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ error: "Failed to create book" });
  }
});

// Update a book
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    if (updated.copies === 0 && updated.available !== false) {
      updated.available = false;
      await updated.save();
    }

    res.json(updated);
  } catch {
    res.status(400).json({ error: "Failed to update book" });
  }
});

// Delete a book
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted" });
  } catch {
    res.status(400).json({ error: "Failed to delete book" });
  }
});

export default router;
