export const mockIncomeTransaction = {
  _id: "txn1",
  userId: "user123",
  type: "income" as const,
  amount: 10000,
  category: "Freelance",
  date: new Date("2026-01-15"),
};

export const mockExpenseTransactions = [
  {
    _id: "txn2",
    userId: "user123",
    type: "expense" as const,
    amount: 3000,
    category: "Food",
    date: new Date("2026-01-10"),
  },
  {
    _id: "txn3",
    userId: "user123",
    type: "expense" as const,
    amount: 2000,
    category: "Travel",
    date: new Date("2026-01-20"),
  },
];

export const mockTransactions = [mockIncomeTransaction, ...mockExpenseTransactions];
