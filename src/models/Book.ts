import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description: string;
  copies: number;
  available?: boolean;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    isbn: { type: String, required: true },
    description: { type: String, required: true },
    copies: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
