import { Schema, model, Document } from "mongoose";

export interface IBorrow extends Document {
  book: Schema.Types.ObjectId;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
}

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
