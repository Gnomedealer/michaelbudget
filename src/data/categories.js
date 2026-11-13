export const EXPENSE_CATEGORIES = [
  { id: "housing", label: "Housing", color: "#6366f1" },
  { id: "food", label: "Food & Dining", color: "#f59e0b" },
  { id: "transport", label: "Transportation", color: "#0ea5e9" },
  { id: "utilities", label: "Bills & Utilities", color: "#8b5cf6" },
  { id: "shopping", label: "Shopping", color: "#ec4899" },
  { id: "entertainment", label: "Entertainment", color: "#14b8a6" },
  { id: "health", label: "Health", color: "#ef4444" },
  { id: "other", label: "Other", color: "#64748b" },
];

export const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary", color: "#16a34a" },
  { id: "freelance", label: "Freelance", color: "#22c55e" },
  { id: "gift", label: "Gifts", color: "#84cc16" },
  { id: "other-income", label: "Other Income", color: "#10b981" },
];

const ALL = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategory(id) {
  return ALL.find((c) => c.id === id) || { id, label: id, color: "#64748b" };
}

export function categoriesFor(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
