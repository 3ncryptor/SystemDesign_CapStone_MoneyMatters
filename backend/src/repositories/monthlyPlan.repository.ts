import { MonthlyPlan, type IMonthlyPlan } from "../models/monthlyPlan.model.js";

export class MonthlyPlanRepository {
  async create(data: Partial<IMonthlyPlan>): Promise<IMonthlyPlan> {
    return MonthlyPlan.create(data);
  }

  async findByUserAndMonth(
    userId: string,
    month: number,
    year: number,
  ): Promise<IMonthlyPlan | null> {
    return MonthlyPlan.findOne({ userId, month, year });
  }

  async updateById(id: string, data: Partial<IMonthlyPlan>): Promise<IMonthlyPlan | null> {
    return MonthlyPlan.findByIdAndUpdate(id, data, { new: true });
  }

  async getClosedPlans(userId: string): Promise<IMonthlyPlan[]> {
    return MonthlyPlan.find({ userId, isClosed: true });
  }

  async findAllByUser(userId: string): Promise<IMonthlyPlan[]> {
    return MonthlyPlan.find({ userId });
  }
}
