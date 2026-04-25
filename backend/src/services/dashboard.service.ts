import type { TransactionRepository } from "../repositories/transaction.repository.js";
import type { MonthlyPlanRepository } from "../repositories/monthlyPlan.repository.js";

export class DashboardService {
  constructor(
    private transactionRepo: TransactionRepository,
    private monthlyRepo: MonthlyPlanRepository,
  ) {}

  async getDashboard(userId: string, month: number, year: number) {
    const transactions = await this.transactionRepo.findByUserAndMonth(userId, month, year);

    let income = 0;
    let expense = 0;
    const categoryMap: Record<string, number> = {};

    for (const t of transactions) {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] ?? 0) + t.amount;
      }
    }

    const savings = income - expense;

    const closedPlans = await this.monthlyRepo.getClosedPlans(userId);
    const currentSavings = closedPlans.reduce((sum, plan) => sum + plan.achievedSavings, 0);

    const plan = await this.monthlyRepo.findByUserAndMonth(userId, month, year);

    const goal = plan?.savingGoal ?? 0;
    const percentage = goal > 0 ? (savings / goal) * 100 : 0;

    return {
      kpis: {
        earnings: income,
        spendings: expense,
        currentSavings,
      },
      categoryBreakdown: Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
      })),
      pieData: {
        income,
        expense,
        savings,
      },
      goalProgress: {
        goal,
        currentSavings: savings,
        percentage,
        goalMet: savings >= goal,
      },
    };
  }
}
