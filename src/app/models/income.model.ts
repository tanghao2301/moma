export interface Income {
  id: string;
  label: string;
  amount: number;
  currency: Currency;
  type: TypeIncome;
  icon?: string;
  frequency?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Currency {
  label: string;
  value: string;
  locale: string;
}

export interface TypeIncome {
  type: string;
  icon: string;
}

export interface Frequency {
  label: string;
  value: string;
  icon: string;
}