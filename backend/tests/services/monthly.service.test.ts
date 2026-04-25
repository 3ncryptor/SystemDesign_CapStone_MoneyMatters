import { MonthlyService } from "../../src/services/monthly.service";
import { ApiError } from "../../src/utils/ApiError";
import { mockMonthlyPlan } from "../mocks/monthly.mock";
import { mockTransactions } from "../mocks/transaction.mock";

const mockMonthlyRepo = {
  create: jest.fn(),
  findByUserAndMonth: jest.fn(),
  updateById: jest.fn(),
  getClosedPlans: jest.fn(),
};

const mockTransactionRepo = {
  create: jest.fn(),
  findByUser: jest.fn(),
  deleteById: jest.fn(),
  findByUserAndMonth: jest.fn(),
};

describe("MonthlyService", () => {
  let service: MonthlyService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MonthlyService(mockMonthlyRepo as any, mockTransactionRepo as any);
  });

  describe("setGoal", () => {
    it("should create a monthly plan", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(null);
      mockMonthlyRepo.create.mockResolvedValue(mockMonthlyPlan);

      const result = await service.setGoal("user123", 1, 2026, 5000);

      expect(mockMonthlyRepo.findByUserAndMonth).toHaveBeenCalledWith("user123", 1, 2026);
      expect(mockMonthlyRepo.create).toHaveBeenCalled();
      expect(result).toEqual(mockMonthlyPlan);
    });

    it("should throw ApiError(400) if plan already exists", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      await expect(service.setGoal("user123", 1, 2026, 5000)).rejects.toThrow(ApiError);
      await expect(service.setGoal("user123", 1, 2026, 5000)).rejects.toThrow(
        "Monthly plan already exists",
      );
    });
  });

  describe("closeMonth", () => {
    it("should calculate income, expense, and savings correctly", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue({ ...mockMonthlyPlan });
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.updateById.mockResolvedValue({
        ...mockMonthlyPlan,
        achievedSavings: 5000,
        goalMet: true,
        isClosed: true,
      });

      // income: 10000, expense: 3000 + 2000 = 5000, savings: 5000
      const result = await service.closeMonth("user123", 1, 2026);

      expect(mockMonthlyRepo.updateById).toHaveBeenCalledWith("plan123", {
        achievedSavings: 5000,
        goalMet: true,
        isClosed: true,
      });
      expect(result?.achievedSavings).toBe(5000);
      expect(result?.goalMet).toBe(true);
    });

    it("should set goalMet to true when savings >= goal", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue({
        ...mockMonthlyPlan,
        savingGoal: 3000,
      });
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.updateById.mockImplementation((_id: string, data: any) => data);

      const result = await service.closeMonth("user123", 1, 2026);

      expect(result?.goalMet).toBe(true);
    });

    it("should set goalMet to false when savings < goal", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue({
        ...mockMonthlyPlan,
        savingGoal: 10000,
      });
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.updateById.mockImplementation((_id: string, data: any) => data);

      const result = await service.closeMonth("user123", 1, 2026);

      expect(result?.goalMet).toBe(false);
    });

    it("should throw ApiError(404) if plan does not exist", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(null);

      await expect(service.closeMonth("user123", 1, 2026)).rejects.toThrow(
        "Monthly plan not found",
      );
    });

    it("should throw ApiError(400) if plan is already closed", async () => {
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue({
        ...mockMonthlyPlan,
        isClosed: true,
      });

      await expect(service.closeMonth("user123", 1, 2026)).rejects.toThrow("Month already closed");
    });
  });
});
