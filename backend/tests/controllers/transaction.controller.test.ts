import { mockIncomeTransaction, mockTransactions } from "../mocks/transaction.mock";

const mockCreateTransaction = jest.fn();
const mockGetUserTransactions = jest.fn();
const mockDeleteTransaction = jest.fn();

jest.mock("../../src/services/transaction.service", () => ({
  TransactionService: jest.fn().mockImplementation(() => ({
    createTransaction: mockCreateTransaction,
    getUserTransactions: mockGetUserTransactions,
    deleteTransaction: mockDeleteTransaction,
  })),
}));

jest.mock("../../src/repositories/transaction.repository", () => ({
  TransactionRepository: jest.fn(),
}));

import { TransactionController } from "../../src/controllers/transaction.controller";

const mockRequest = (overrides: any = {}) => ({
  body: {},
  params: {},
  user: { userId: "user123" },
  ...overrides,
});

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();
const flushPromises = () => new Promise((resolve) => process.nextTick(resolve));

describe("TransactionController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return 201 with the created transaction", async () => {
      mockCreateTransaction.mockResolvedValue(mockIncomeTransaction);
      const req = mockRequest({
        body: { amount: 10000, type: "income", category: "Freelance" },
      });
      const res = mockResponse();

      TransactionController.create(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockCreateTransaction).toHaveBeenCalledWith({
        amount: 10000,
        type: "income",
        category: "Freelance",
        userId: "user123",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockIncomeTransaction,
        }),
      );
    });
  });

  describe("getAll", () => {
    it("should return 200 with all user transactions", async () => {
      mockGetUserTransactions.mockResolvedValue(mockTransactions);
      const req = mockRequest();
      const res = mockResponse();

      TransactionController.getAll(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockGetUserTransactions).toHaveBeenCalledWith("user123");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockTransactions,
        }),
      );
    });
  });

  describe("delete", () => {
    it("should return 200 with the deleted transaction", async () => {
      mockDeleteTransaction.mockResolvedValue(mockIncomeTransaction);
      const req = mockRequest({ params: { id: "txn1" } });
      const res = mockResponse();

      TransactionController.delete(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockDeleteTransaction).toHaveBeenCalledWith("txn1");
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockIncomeTransaction,
        }),
      );
    });

    it("should call next with error if transaction not found", async () => {
      const error = new Error("Not found");
      mockDeleteTransaction.mockRejectedValue(error);
      const req = mockRequest({ params: { id: "nonexistent" } });
      const res = mockResponse();

      TransactionController.delete(req as any, res as any, mockNext);
      await flushPromises();

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
