// Example data so a new visitor can see what the app does.
// Dates are generated inside the given month.

let counter = 0;
const id = () => `sample-${Date.now()}-${counter++}`;

export function sampleTransactions(month) {
  const day = (d) => `${month}-${String(d).padStart(2, "0")}`;
  return [
    { type: "income", description: "Paycheck", category: "salary", amount: 285000, date: day(1) },
    { type: "income", description: "Paycheck", category: "salary", amount: 285000, date: day(15) },
    { type: "income", description: "Logo design gig", category: "freelance", amount: 40000, date: day(9) },
    { type: "expense", description: "Rent", category: "housing", amount: 210000, date: day(1) },
    { type: "expense", description: "Groceries", category: "food", amount: 13452, date: day(3) },
    { type: "expense", description: "Gas", category: "transport", amount: 5210, date: day(4) },
    { type: "expense", description: "Electric bill", category: "utilities", amount: 9875, date: day(6) },
    { type: "expense", description: "Phone bill", category: "utilities", amount: 6500, date: day(8) },
    { type: "expense", description: "Dinner out", category: "food", amount: 6840, date: day(10) },
    { type: "expense", description: "Movie tickets", category: "entertainment", amount: 3200, date: day(11) },
    { type: "expense", description: "New shoes", category: "shopping", amount: 8999, date: day(12) },
    { type: "expense", description: "Groceries", category: "food", amount: 11820, date: day(13) },
    { type: "expense", description: "Pharmacy", category: "health", amount: 2450, date: day(14) },
  ].map((t) => ({ ...t, id: id(), createdAt: Date.now() }));
}

export const sampleBudgets = {
  housing: 210000,
  food: 50000,
  transport: 20000,
  utilities: 25000,
  shopping: 15000,
  entertainment: 10000,
  health: 10000,
};
