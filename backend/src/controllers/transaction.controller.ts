import { TransactionService } from "../services/transaction.service.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const service = new TransactionService(new TransactionRepository());

export class TransactionController {
  static create = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const transaction = await service.createTransaction({
      ...req.body,
      userId,
    });

    res.status(201).json(new ApiResponse(201, transaction, "Transaction created"));
  });

  static getAll = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const data = await service.getUserTransactions(userId);

    res.json(new ApiResponse(200, data, "Transactions fetched"));
  });

  static delete = asyncHandler(async (req, res) => {
    const id = req.params.id as string;

    const data = await service.deleteTransaction(id);

    res.json(new ApiResponse(200, data, "Transaction deleted"));
  });
}
