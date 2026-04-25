import { MonthlyService } from "../services/monthly.service.js";
import { MonthlyPlanRepository } from "../repositories/monthlyPlan.repository.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const service = new MonthlyService(new MonthlyPlanRepository(), new TransactionRepository());

export class MonthlyController {
  static setGoal = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { month, year, goal, savingGoal } = req.body ?? {};

    const parsedMonth = Number(month);
    const parsedYear = Number(year);
    const parsedGoal = Number(goal ?? savingGoal);

    if (!Number.isInteger(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
      throw new ApiError(400, "Invalid month");
    }

    if (!Number.isInteger(parsedYear) || parsedYear <= 0) {
      throw new ApiError(400, "Invalid year");
    }

    if (!Number.isFinite(parsedGoal) || parsedGoal <= 0) {
      throw new ApiError(400, "Invalid saving goal");
    }

    const data = await service.setGoal(userId, parsedMonth, parsedYear, parsedGoal);

    res.json(new ApiResponse(200, data, "Goal set successfully"));
  });

  static closeMonth = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { month, year } = req.body ?? {};

    const now = new Date();
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    const closeMonth = Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : now.getMonth() + 1;

    const closeYear = Number.isInteger(parsedYear) && parsedYear > 0
      ? parsedYear
      : now.getFullYear();

    const data = await service.closeMonth(userId, closeMonth, closeYear);

    res.json(new ApiResponse(200, data, "Month closed successfully"));
  });

  static getPlans = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const data = await service.getAllPlans(userId);
    res.json(new ApiResponse(200, data, "Monthly plans fetched successfully"));
  });
}
