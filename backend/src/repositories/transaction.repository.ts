import { Transaction, type ITransaction } from "../models/transaction.model.js";
import { Types } from "mongoose";

export class TransactionRepository {
  async create(data: Partial<ITransaction>): Promise<ITransaction> {
    if (data.userId && typeof data.userId === "string") {
      data.userId = new Types.ObjectId(data.userId as string);
    }
    return Transaction.create(data);
  }

  async findByUser(userId: string): Promise<ITransaction[]> {
    return Transaction.find({ userId });
  }

  async deleteById(id: string): Promise<ITransaction | null> {
    return Transaction.findByIdAndDelete(id);
  }

  async findByUserAndMonth(userId: string, month: number, year: number): Promise<ITransaction[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    return Transaction.find({
      userId: new Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    });
  }
}
