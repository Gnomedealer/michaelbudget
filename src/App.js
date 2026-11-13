import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import CategoryBudgets from "./components/CategoryBudgets";
import TransactionList from "./components/TransactionList";
import useLocalStorage from "./hooks/useLocalStorage";
import { sampleBudgets, sampleTransactions } from "./data/sampleData";
import { currentMonth, monthOf, today } from "./utils/dates";
import { downloadCsv, transactionsToCsv } from "./utils/csv";

let nextId = 0;
const newId = () => `${Date.now()}-${nextId++}`;

function App() {
  // Saved in the browser, so data survives a refresh.
  const [transactions, setTransactions] = useLocalStorage("mmt.transactions", []);
  const [budgets, setBudgets] = useLocalStorage("mmt.budgets", {});

  const [month, setMonth] = useState(currentMonth());
  const [editing, setEditing] = useState(null);

  // Everything below is derived from state on each render; nothing is
  // stored twice, so totals can never get out of sync with the list.
  const monthTransactions = transactions.filter((t) => monthOf(t.date) === month);

  let income = 0;
  let expenses = 0;
  const spentByCategory = {};
  monthTransactions.forEach((t) => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expenses += t.amount;
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
    }
  });

  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
  const defaultDate = month === currentMonth() ? today() : `${month}-01`;

  function handleSave(data) {
    if (editing) {
      setTransactions((prev) => prev.map((t) => (t.id === editing.id ? { ...t, ...data } : t)));
      setEditing(null);
    } else {
      setTransactions((prev) => [...prev, { ...data, id: newId(), createdAt: Date.now() }]);
    }
  }

  function handleDelete(transaction) {
    if (!window.confirm(`Delete "${transaction.description}"?`)) return;
    setTransactions((prev) => prev.filter((t) => t.id !== transaction.id));
    if (editing && editing.id === transaction.id) setEditing(null);
  }

  function handleMonthChange(next) {
    setMonth(next);
    setEditing(null);
  }

  function loadSample() {
    setTransactions((prev) => [...prev, ...sampleTransactions(month)]);
    if (Object.keys(budgets).length === 0) setBudgets(sampleBudgets);
  }

  function exportMonth() {
    downloadCsv(`transactions-${month}.csv`, transactionsToCsv(monthTransactions));
  }

  return (
    <>
      <Header month={month} onMonthChange={handleMonthChange} />

      <main className="container">
        <SummaryCards income={income} expenses={expenses} totalBudget={totalBudget} />

        <div className="layout">
          <div className="side">
            <TransactionForm
              key={editing ? editing.id : `new-${month}`}
              initial={editing}
              defaultDate={defaultDate}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
            />
            <CategoryBudgets budgets={budgets} spentByCategory={spentByCategory} onSaveBudgets={setBudgets} />
          </div>

          <div className="main-col">
            <TransactionList
              transactions={monthTransactions}
              editingId={editing && editing.id}
              onEdit={setEditing}
              onDelete={handleDelete}
            />

            <div className="toolbar">
              {transactions.length === 0 && (
                <button className="btn btn-ghost" onClick={loadSample}>
                  Load sample data
                </button>
              )}
              <button className="btn btn-ghost" onClick={exportMonth} disabled={monthTransactions.length === 0}>
                Export month to CSV
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Your data is saved in this browser only.</p>
      </footer>
    </>
  );
}

export default App;
