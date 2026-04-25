import mongoose, { type Document, Schema, type Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
}

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
