export interface Income {
  id: string;
  amount: number;
  currency: Currency;
  type: TypeIncome;
  frequency: string;
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

export interface TypeIncome {
  name: string;
  icon: string;
}

export interface Frequency {
  label: string;
  value: string;
  icon: string;
}