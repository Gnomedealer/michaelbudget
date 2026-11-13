import { getCategory } from "../data/categories";

// Wrap a value in quotes and escape any quotes inside it.
const cell = (value) => `"${String(value).replace(/"/g, '""')}"`;

export function transactionsToCsv(transactions) {
  const header = ["Date", "Type", "Description", "Category", "Amount"];
  const rows = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => [
      t.date,
      t.type,
      t.description,
      getCategory(t.category).label,
      ((t.type === "expense" ? -t.amount : t.amount) / 100).toFixed(2),
    ]);
  return [header, ...rows].map((row) => row.map(cell).join(",")).join("\n");
}

export function downloadCsv(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
