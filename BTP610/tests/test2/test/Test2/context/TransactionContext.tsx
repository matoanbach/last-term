import React, { createContext, useState, ReactNode } from "react";
import { Transaction } from "../types/Transaction";

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
};

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  addTransaction: () => {},
});

type Props = {
  children: ReactNode;
};

export const TransactionProvider = ({ children }: Props) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};