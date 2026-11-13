import { formatMoney } from "../utils/money";

function SummaryCards({ income, expenses, totalBudget }) {
  const net = income - expenses;
  const budgetLeft = totalBudget - expenses;

  return (
    <section className="summary" aria-label="Monthly summary">
      <div className="card stat">
        <p className="stat-label">Income</p>
        <p className="stat-value positive" data-testid="income-total">{formatMoney(income)}</p>
      </div>
      <div className="card stat">
        <p className="stat-label">Expenses</p>
        <p className="stat-value" data-testid="expense-total">{formatMoney(expenses)}</p>
      </div>
      <div className="card stat">
        <p className="stat-label">Net savings</p>
        <p className={`stat-value ${net < 0 ? "negative" : "positive"}`} data-testid="net-total">
          {formatMoney(net)}
        </p>
      </div>
      <div className="card stat">
        <p className="stat-label">Budget left</p>
        {totalBudget > 0 ? (
          <>
            <p className={`stat-value ${budgetLeft < 0 ? "negative" : ""}`}>{formatMoney(budgetLeft)}</p>
            <p className="stat-sub">of {formatMoney(totalBudget)}</p>
          </>
        ) : (
          <p className="stat-sub">No budgets set yet</p>
        )}
      </div>
    </section>
  );
}

export default SummaryCards;
