
export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  type: Type;
  frequency: string;
  transactionType: TransactionType;
  convertedAmount: number;
  icon?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Currency {
  label: string;
  value: string;
  locale: string;
}

export interface Type {
  name: string;
  icon: string;
}

export interface Frequency {
  label: string;
  value: string;
  icon: string;
}

export type TransactionType = 'Income' | 'Expense';