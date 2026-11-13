import { formatMoney, toCents } from "./money";
import { formatMonth, shiftMonth } from "./dates";
import { transactionsToCsv } from "./csv";

test("toCents avoids floating point errors", () => {
  expect(toCents("12.99")).toBe(1299);
  expect(toCents("0.1") + toCents("0.2")).toBe(toCents("0.3"));
  expect(toCents("")).toBeNaN();
});

test("formatMoney shows dollars and cents", () => {
  expect(formatMoney(123456)).toBe("$1,234.56");
  expect(formatMoney(-500)).toBe("-$5.00");
});

test("shiftMonth handles year boundaries", () => {
  expect(shiftMonth("2026-01", -1)).toBe("2025-12");
  expect(shiftMonth("2026-12", 1)).toBe("2027-01");
  expect(formatMonth("2026-11")).toBe("November 2026");
});

test("CSV export escapes quotes and signs expenses negative", () => {
  const csv = transactionsToCsv([
    { date: "2026-11-02", type: "expense", description: 'Pizza "large"', category: "food", amount: 1850 },
    { date: "2026-11-01", type: "income", description: "Paycheck", category: "salary", amount: 100000 },
  ]);
  expect(csv.split("\n")).toEqual([
    '"Date","Type","Description","Category","Amount"',
    '"2026-11-01","income","Paycheck","Salary","1000.00"',
    '"2026-11-02","expense","Pizza ""large""","Food & Dining","-18.50"',
  ]);
});
