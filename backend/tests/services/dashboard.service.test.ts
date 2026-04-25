import { DashboardService } from "../../src/services/dashboard.service";
import { mockTransactions } from "../mocks/transaction.mock";
import { mockMonthlyPlan, mockClosedPlan } from "../mocks/monthly.mock";

const mockTransactionRepo = {
  create: jest.fn(),
  findByUser: jest.fn(),
  deleteById: jest.fn(),
  findByUserAndMonth: jest.fn(),
};

const mockMonthlyRepo = {
  create: jest.fn(),
  findByUserAndMonth: jest.fn(),
  updateById: jest.fn(),
  getClosedPlans: jest.fn(),
};

describe("DashboardService", () => {
  let service: DashboardService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DashboardService(mockTransactionRepo as any, mockMonthlyRepo as any);
  });

  describe("getDashboard", () => {
    it("should calculate total income correctly", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.kpis.earnings).toBe(10000);
    });

    it("should calculate total expenses correctly", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.kpis.spendings).toBe(5000);
    });

    it("should calculate savings as income minus expense", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.pieData.savings).toBe(5000);
    });

    it("should aggregate expenses by category", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      const foodCategory = result.categoryBreakdown.find(
        (c: { category: string }) => c.category === "Food",
      );
      const travelCategory = result.categoryBreakdown.find(
        (c: { category: string }) => c.category === "Travel",
      );

      expect(foodCategory?.amount).toBe(3000);
      expect(travelCategory?.amount).toBe(2000);
    });

    it("should calculate goal progress percentage", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      // savings = 5000, goal = 5000 => 100%
      expect(result.goalProgress.percentage).toBe(100);
      expect(result.goalProgress.goalMet).toBe(true);
    });

    it("should return zeros when there are no transactions", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue([]);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.kpis.earnings).toBe(0);
      expect(result.kpis.spendings).toBe(0);
      expect(result.pieData.savings).toBe(0);
      expect(result.categoryBreakdown).toEqual([]);
    });

    it("should default goal to 0 when no monthly plan exists", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(mockTransactions);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(null);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.goalProgress.goal).toBe(0);
      expect(result.goalProgress.percentage).toBe(0);
    });

    it("should sum achievedSavings from all closed plans", async () => {
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue([]);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([
        { ...mockClosedPlan, achievedSavings: 6000 },
        { ...mockClosedPlan, achievedSavings: 4000 },
      ]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(null);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.kpis.currentSavings).toBe(10000);
    });

    it("should handle negative savings when expenses exceed income", async () => {
      const onlyExpenses = [
        { type: "expense", amount: 8000, category: "Rent" },
        { type: "income", amount: 3000, category: "Freelance" },
      ];
      mockTransactionRepo.findByUserAndMonth.mockResolvedValue(onlyExpenses);
      mockMonthlyRepo.getClosedPlans.mockResolvedValue([]);
      mockMonthlyRepo.findByUserAndMonth.mockResolvedValue(mockMonthlyPlan);

      const result = await service.getDashboard("user123", 1, 2026);

      expect(result.pieData.savings).toBe(-5000);
      expect(result.goalProgress.goalMet).toBe(false);
    });
  });
});
