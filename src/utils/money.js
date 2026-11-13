// Money is stored as whole cents (integers) so math never drifts:
// 0.1 + 0.2 !== 0.3 in JavaScript, but 10 + 20 === 30.

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

// "12.99" -> 1299. Returns NaN for anything that isn't a number.
export function toCents(value) {
  const number = parseFloat(value);
  if (!Number.isFinite(number)) return NaN;
  return Math.round(number * 100);
}

// 1299 -> "12.99" (for filling form inputs)
export function centsToInput(cents) {
  return (cents / 100).toFixed(2);
}

// 1299 -> "$12.99"
export function formatMoney(cents) {
  return formatter.format(cents / 100);
}
