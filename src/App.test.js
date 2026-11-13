import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

function addTransaction({ type = "Expense", description, amount, category }) {
  const form = screen.getByRole("form", { name: "Add transaction" });
  userEvent.click(within(form).getByRole("button", { name: type }));
  userEvent.type(within(form).getByLabelText("Description"), description);
  userEvent.type(within(form).getByLabelText("Amount ($)"), amount);
  if (category) userEvent.selectOptions(within(form).getByLabelText("Category"), category);
  userEvent.click(within(form).getByRole("button", { name: "Add" }));
}

test("shows the app title and an empty state", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: /michael's money tracker/i })).toBeInTheDocument();
  expect(screen.getByText(/no transactions this month yet/i)).toBeInTheDocument();
});

test("adding income and expenses updates the totals, including cents", () => {
  render(<App />);
  addTransaction({ type: "Income", description: "Paycheck", amount: "1000" });
  addTransaction({ description: "Groceries", amount: "12.99" });

  expect(screen.getByText("Paycheck")).toBeInTheDocument();
  expect(screen.getByText("Groceries")).toBeInTheDocument();
  expect(screen.getByTestId("income-total")).toHaveTextContent("$1,000.00");
  expect(screen.getByTestId("expense-total")).toHaveTextContent("$12.99");
  expect(screen.getByTestId("net-total")).toHaveTextContent("$987.01");
});

test("shows an error instead of adding an empty transaction", () => {
  render(<App />);
  const form = screen.getByRole("form", { name: "Add transaction" });
  userEvent.click(within(form).getByRole("button", { name: "Add" }));
  expect(screen.getByRole("alert")).toHaveTextContent("Add a description.");
});

test("deleting a transaction removes it and updates totals", () => {
  jest.spyOn(window, "confirm").mockReturnValue(true);
  render(<App />);
  addTransaction({ description: "Coffee", amount: "5" });

  userEvent.click(screen.getByRole("button", { name: "Delete Coffee" }));
  expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
  expect(screen.getByTestId("expense-total")).toHaveTextContent("$0.00");
  window.confirm.mockRestore();
});

test("editing a transaction changes its amount", () => {
  render(<App />);
  addTransaction({ description: "Gas", amount: "40" });

  userEvent.click(screen.getByRole("button", { name: "Edit Gas" }));
  const form = screen.getByRole("form", { name: "Edit transaction" });
  const amount = within(form).getByLabelText("Amount ($)");
  userEvent.clear(amount);
  userEvent.type(amount, "55.50");
  userEvent.click(within(form).getByRole("button", { name: "Save changes" }));

  expect(screen.getByTestId("expense-total")).toHaveTextContent("$55.50");
});

test("data is saved and comes back after a reload", () => {
  const { unmount } = render(<App />);
  addTransaction({ description: "Rent", amount: "2100" });
  unmount();

  render(<App />);
  expect(screen.getByText("Rent")).toBeInTheDocument();
});

test("budgets show spending against the limit", () => {
  render(<App />);
  addTransaction({ description: "Dinner", amount: "60", category: "food" });

  userEvent.click(screen.getByRole("button", { name: "Set budgets" }));
  userEvent.type(screen.getByLabelText("Food & Dining budget"), "50");
  userEvent.click(screen.getByRole("button", { name: "Save budgets" }));

  expect(screen.getByText("$60.00 / $50.00")).toBeInTheDocument();
  expect(screen.getByText("Over by $10.00")).toBeInTheDocument();
});
