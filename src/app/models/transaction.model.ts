
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

export type TransactionType = 'Income' | 'Expense' | 'Installment';

export interface Installment {
  id: string;
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency: Currency;
  startDate: Date;
  nextPaymentDate: Date;
  durationMonths: number;
  completedMonths: number;
  category: string;
  icon: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  schedule?: PaymentScheduleItem[];
}

export interface PaymentScheduleItem {
  id: string;
  period: string; // e.g., "1 of 12"
  dueDate: Date;
  amount: number;
  status: 'Paid' | 'Upcoming' | 'Next';
}
