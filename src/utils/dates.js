// Dates are stored as "YYYY-MM-DD" strings and months as "YYYY-MM".
// Working with strings avoids time-zone surprises from Date objects.

const pad = (n) => String(n).padStart(2, "0");

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function currentMonth() {
  return today().slice(0, 7);
}

// "2026-11-13" -> "2026-11"
export function monthOf(date) {
  return date.slice(0, 7);
}

// ("2026-11", -1) -> "2026-10"
export function shiftMonth(month, delta) {
  const [year, m] = month.split("-").map(Number);
  const d = new Date(year, m - 1 + delta, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

// "2026-11" -> "November 2026"
export function formatMonth(month) {
  const [year, m] = month.split("-").map(Number);
  return new Date(year, m - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// "2026-11-13" -> "Nov 13"
export function formatDay(date) {
  const [year, m, day] = date.split("-").map(Number);
  return new Date(year, m - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
