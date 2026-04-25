import { TransactionService } from "../../src/services/transaction.service";
import { ApiError } from "../../src/utils/ApiError";
import { mockTransactions, mockIncomeTransaction } from "../mocks/transaction.mock";

const mockRepo = {
  create: jest.fn(),
  findByUser: jest.fn(),
  deleteById: jest.fn(),
  findByUserAndMonth: jest.fn(),
};

describe("TransactionService", () => {
  let service: TransactionService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TransactionService(mockRepo as any);
  });

  describe("createTransaction", () => {
    it("should create and return a valid transaction", async () => {
      const input = { amount: 10000, type: "income", category: "Freelance", userId: "user123" };
      mockRepo.create.mockResolvedValue(mockIncomeTransaction);

      const result = await service.createTransaction(input);

      expect(mockRepo.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockIncomeTransaction);
    });

    it("should throw ApiError(400) if amount is zero", async () => {
      await expect(
        service.createTransaction({ amount: 0, type: "income", category: "Test" }),
      ).rejects.toThrow(ApiError);
      await expect(
        service.createTransaction({ amount: 0, type: "income", category: "Test" }),
      ).rejects.toThrow("Amount must be greater than 0");
    });

    it("should throw ApiError(400) if amount is negative", async () => {
      await expect(
        service.createTransaction({ amount: -100, type: "expense", category: "Test" }),
      ).rejects.toThrow("Amount must be greater than 0");
    });
  });

  describe("getUserTransactions", () => {
    it("should return all transactions for a user", async () => {
      mockRepo.findByUser.mockResolvedValue(mockTransactions);

      const result = await service.getUserTransactions("user123");

      expect(mockRepo.findByUser).toHaveBeenCalledWith("user123");
      expect(result).toEqual(mockTransactions);
    });

    it("should return empty array if no transactions exist", async () => {
      mockRepo.findByUser.mockResolvedValue([]);

      const result = await service.getUserTransactions("user123");

      expect(result).toEqual([]);
    });
  });

  describe("deleteTransaction", () => {
    it("should delete and return the transaction", async () => {
      mockRepo.deleteById.mockResolvedValue(mockIncomeTransaction);

      const result = await service.deleteTransaction("txn1");

      expect(mockRepo.deleteById).toHaveBeenCalledWith("txn1");
      expect(result).toEqual(mockIncomeTransaction);
    });

    it("should throw ApiError(404) if transaction not found", async () => {
      mockRepo.deleteById.mockResolvedValue(null);

      await expect(service.deleteTransaction("nonexistent")).rejects.toThrow(ApiError);
      await expect(service.deleteTransaction("nonexistent")).rejects.toThrow(
        "Transaction not found",
      );
    });
  });
});
