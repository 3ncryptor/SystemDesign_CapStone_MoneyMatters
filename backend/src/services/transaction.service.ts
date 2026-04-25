import type { TransactionRepository } from "../repositories/transaction.repository.js";
import type { ITransaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";

export class TransactionService {
  constructor(private repo: TransactionRepository) {}

  async createTransaction(data: Partial<ITransaction>) {
    if (!data.amount || data.amount <= 0) {
      throw new ApiError(400, "Amount must be greater than 0");
    }

    return this.repo.create(data);
  }

  async getUserTransactions(userId: string) {
    return this.repo.findByUser(userId);
  }

  async deleteTransaction(id: string) {
    const deleted = await this.repo.deleteById(id);
    if (!deleted) throw new ApiError(404, "Transaction not found");

    return deleted;
  }
}
