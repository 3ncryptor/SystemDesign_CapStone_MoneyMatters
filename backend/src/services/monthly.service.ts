import type { Types } from "mongoose";
import type { MonthlyPlanRepository } from "../repositories/monthlyPlan.repository.js";
import type { TransactionRepository } from "../repositories/transaction.repository.js";
import { ApiError } from "../utils/ApiError.js";

export class MonthlyService {
  constructor(
    private monthlyRepo: MonthlyPlanRepository,
    private transactionRepo: TransactionRepository,
  ) {}

  async setGoal(userId: string, month: number, year: number, goal: number) {
    const existing = await this.monthlyRepo.findByUserAndMonth(userId, month, year);

    if (existing) {
      throw new ApiError(400, "Monthly plan already exists");
    }

    return this.monthlyRepo.create({
      userId: userId as unknown as Types.ObjectId,
      month,
      year,
      savingGoal: goal,
    });
  }

  async closeMonth(userId: string, month: number, year: number) {
    const plan = await this.monthlyRepo.findByUserAndMonth(userId, month, year);

    if (!plan) throw new ApiError(404, "Monthly plan not found");
    if (plan.isClosed) throw new ApiError(400, "Month already closed");

    const transactions = await this.transactionRepo.findByUserAndMonth(userId, month, year);

    let income = 0;
    let expense = 0;

    for (const t of transactions) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    }

    const savings = income - expense;
    const goalMet = savings >= plan.savingGoal;

    return this.monthlyRepo.updateById(plan._id.toString(), {
      achievedSavings: savings,
      goalMet,
      isClosed: true,
    });
  }

  async getAllPlans(userId: string) {
    return this.monthlyRepo.findAllByUser(userId);
  }
}
