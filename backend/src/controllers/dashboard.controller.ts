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

    const now = new Date();
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    const dashboardMonth =
      Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
        ? parsedMonth
        : now.getMonth() + 1;

    const dashboardYear =
      Number.isInteger(parsedYear) && parsedYear > 0 ? parsedYear : now.getFullYear();

    const data = await service.getDashboard(userId, dashboardMonth, dashboardYear);

    res.json(new ApiResponse(200, data, "Dashboard data fetched"));
  });
}
