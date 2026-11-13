import { useState } from "react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategory } from "../data/categories";
import { formatDay } from "../utils/dates";
import { formatMoney } from "../utils/money";

function TransactionList({ transactions, editingId, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");

  const visible = transactions
    .filter((t) => type === "all" || t.type === type)
    .filter((t) => category === "all" || t.category === category)
    .filter((t) => t.description.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);

  const filtered = search || type !== "all" || category !== "all";

  return (
    <section className="card list-card">
      <div className="card-head">
        <h2 className="card-title">Transactions</h2>
        <span className="muted small">
          {visible.length} of {transactions.length}
        </span>
      </div>

      <div className="filters">
        <input
          type="search"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search transactions"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type">
          <option value="all">All types</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          <option value="all">All categories</option>
          <optgroup label="Expenses">
            {EXPENSE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Income">
            {INCOME_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="empty">
          {filtered ? "No transactions match your filters." : "No transactions this month yet. Add one to get started."}
        </p>
      ) : (
        <ul className="tx-list">
          {visible.map((t) => {
            const cat = getCategory(t.category);
            return (
              <li key={t.id} className={`tx ${editingId === t.id ? "tx-editing" : ""}`}>
                <i className="dot dot-lg" style={{ background: cat.color }} aria-hidden="true" />
                <div className="tx-main">
                  <p className="tx-desc">{t.description}</p>
                  <p className="tx-meta">
                    {cat.label} · {formatDay(t.date)}
                  </p>
                </div>
                <p className={`tx-amount ${t.type === "income" ? "positive" : ""}`}>
                  {t.type === "income" ? "+" : "−"}
                  {formatMoney(t.amount)}
                </p>
                <div className="tx-actions">
                  <button className="icon-btn" aria-label={`Edit ${t.description}`} onClick={() => onEdit(t)}>
                    ✎
                  </button>
                  <button className="icon-btn danger" aria-label={`Delete ${t.description}`} onClick={() => onDelete(t)}>
                    🗑
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TransactionList;
