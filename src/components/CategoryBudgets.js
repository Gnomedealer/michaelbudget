import { useState } from "react";
import { EXPENSE_CATEGORIES } from "../data/categories";
import { centsToInput, formatMoney, toCents } from "../utils/money";

// Shows how much of each category's monthly limit has been spent,
// and lets you edit those limits.
function CategoryBudgets({ budgets, spentByCategory, onSaveBudgets }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});

  function startEditing() {
    const values = {};
    EXPENSE_CATEGORIES.forEach((c) => {
      values[c.id] = budgets[c.id] ? centsToInput(budgets[c.id]) : "";
    });
    setDraft(values);
    setEditing(true);
  }

  function save(event) {
    event.preventDefault();
    const next = {};
    Object.entries(draft).forEach(([id, value]) => {
      const cents = toCents(value);
      if (cents > 0) next[id] = cents;
    });
    onSaveBudgets(next);
    setEditing(false);
  }

  // Show categories that have a budget or spending this month.
  const rows = EXPENSE_CATEGORIES.filter((c) => budgets[c.id] || spentByCategory[c.id]);

  return (
    <section className="card">
      <div className="card-head">
        <h2 className="card-title">Budgets</h2>
        {!editing && (
          <button className="btn btn-ghost btn-small" onClick={startEditing}>
            {Object.keys(budgets).length ? "Edit" : "Set budgets"}
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={save} className="budget-form">
          <p className="muted small">Monthly limit for each category. Leave blank for no limit.</p>
          {EXPENSE_CATEGORIES.map((c) => (
            <label key={c.id} className="budget-input">
              <span>
                <i className="dot" style={{ background: c.color }} />
                {c.label}
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="—"
                value={draft[c.id]}
                onChange={(e) => setDraft((prev) => ({ ...prev, [c.id]: e.target.value }))}
                aria-label={`${c.label} budget`}
              />
            </label>
          ))}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save budgets
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : rows.length === 0 ? (
        <p className="muted small">Set monthly limits to see how your spending tracks against them.</p>
      ) : (
        <ul className="budget-list">
          {rows.map((c) => {
            const spent = spentByCategory[c.id] || 0;
            const limit = budgets[c.id] || 0;
            const pct = limit ? Math.min(100, (spent / limit) * 100) : 0;
            const over = limit && spent > limit;
            return (
              <li key={c.id} className="budget-row">
                <div className="budget-row-head">
                  <span>
                    <i className="dot" style={{ background: c.color }} />
                    {c.label}
                  </span>
                  <span className={over ? "negative" : "muted"}>
                    {formatMoney(spent)}
                    {limit ? ` / ${formatMoney(limit)}` : ""}
                  </span>
                </div>
                {limit > 0 && (
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={`${c.label} budget used`}
                    aria-valuenow={Math.round((spent / limit) * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`progress-bar ${over ? "over" : pct >= 85 ? "warn" : ""}`}
                      style={{ width: `${pct}%`, background: over || pct >= 85 ? undefined : c.color }}
                    />
                  </div>
                )}
                {over && <p className="over-note">Over by {formatMoney(spent - limit)}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CategoryBudgets;
