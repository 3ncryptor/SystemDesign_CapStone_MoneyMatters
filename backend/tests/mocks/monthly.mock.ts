export const mockMonthlyPlan = {
  _id: { toString: () => "plan123" },
  userId: "user123",
  month: 1,
  year: 2026,
  savingGoal: 5000,
  achievedSavings: 0,
  goalMet: false,
  isClosed: false,
};

export const mockClosedPlan = {
  _id: { toString: () => "plan456" },
  userId: "user123",
  month: 12,
  year: 2025,
  savingGoal: 4000,
  achievedSavings: 6000,
  goalMet: true,
  isClosed: true,
};
