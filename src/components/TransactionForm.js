import { useState } from "react";
import { categoriesFor } from "../data/categories";
import { centsToInput, toCents } from "../utils/money";

// Used for both adding and editing. When `initial` is given, the form
// starts filled in with that transaction.
function TransactionForm({ initial, defaultDate, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, amount: centsToInput(initial.amount) }
      : { type: "expense", description: "", amount: "", category: "food", date: defaultDate }
  );
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function changeType(type) {
    // Switching type also switches to that type's first category.
    setForm((prev) => ({ ...prev, type, category: categoriesFor(type)[0].id }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const amount = toCents(form.amount);

    if (!form.description.trim()) return setError("Add a description.");
    if (!(amount > 0)) return setError("Amount must be greater than $0.");
    if (!form.date) return setError("Pick a date.");

    setError("");
    onSave({ ...form, description: form.description.trim(), amount });

    if (!initial) {
      // Keep type, category and date so entering several in a row is quick.
      setForm((prev) => ({ ...prev, description: "", amount: "" }));
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit} aria-label={initial ? "Edit transaction" : "Add transaction"}>
      <h2 className="card-title">{initial ? "Edit transaction" : "Add transaction"}</h2>

      <div className="segmented" role="group" aria-label="Transaction type">
        {["expense", "income"].map((type) => (
          <button
            key={type}
            type="button"
            className={form.type === type ? "active" : ""}
            aria-pressed={form.type === type}
            onClick={() => changeType(type)}
          >
            {type === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>

      <label className="field">
        <span>Description</span>
        <input
          type="text"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder={form.type === "expense" ? "Groceries, rent, gas…" : "Paycheck, side gig…"}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Amount ($)</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => update("amount", e.target.value)}
            placeholder="0.00"
          />
        </label>

        <label className="field">
          <span>Date</span>
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        </label>
      </div>

      <label className="field">
        <span>Category</span>
        <select value={form.category} onChange={(e) => update("category", e.target.value)}>
          {categoriesFor(form.type).map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {initial ? "Save changes" : "Add"}
        </button>
        {initial && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;
