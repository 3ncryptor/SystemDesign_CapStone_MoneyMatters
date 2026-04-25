import { DashboardService } from "../services/dashboard.service.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { MonthlyPlanRepository } from "../repositories/monthlyPlan.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const service = new DashboardService(new TransactionRepository(), new MonthlyPlanRepository());

export class DashboardController {
  static getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { month, year } = req.query;

    const data = await service.getDashboard(userId, Number(month), Number(year));

    res.json(new ApiResponse(200, data, "Dashboard data fetched"));
  });
}
