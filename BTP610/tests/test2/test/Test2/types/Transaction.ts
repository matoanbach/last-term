export type TransactionType = "Deposit" | "Expense";

export type CategoryType =
  | "Utilities"
  | "Transportations"
  | "Groceries"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Payroll";

export type Transaction = {
  id: string;
  name: string;
  amount: number;
  location: string;
  date: string;
  description: string;
  type: TransactionType;
  category: CategoryType;
};