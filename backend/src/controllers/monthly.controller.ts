import { MonthlyService } from "../services/monthly.service.js";
import { MonthlyPlanRepository } from "../repositories/monthlyPlan.repository.js";
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const service = new MonthlyService(new MonthlyPlanRepository(), new TransactionRepository());

export class MonthlyController {
  static setGoal = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { month, year, goal } = req.body;

    const data = await service.setGoal(userId, month, year, goal);

    res.json(new ApiResponse(200, data, "Goal set successfully"));
  });

  static closeMonth = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { month, year } = req.body;

    const data = await service.closeMonth(userId, month, year);

    res.json(new ApiResponse(200, data, "Month closed successfully"));
  });
}
