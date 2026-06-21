export interface Saving {
  id?: string;
  name: string;
  institution: string;
  accountNumber?: string;
  balance: number;
  currency: string;
  interestRate?: number;
  type: SavingType;
  lastUpdated?: number;
}

export enum SavingType {
  SAVINGS_ACCOUNT = 'Savings Account',
  CHECKING_ACCOUNT = 'Checking Account',
  FIXED_DEPOSIT = 'Fixed Deposit',
  OTHER = 'Other'
}

export const SAVING_TYPE_OPTIONS = [
  { label: 'Savings Account', value: SavingType.SAVINGS_ACCOUNT, icon: 'pi-wallet' },
  { label: 'Checking Account', value: SavingType.CHECKING_ACCOUNT, icon: 'pi-building-columns' },
  { label: 'Fixed Deposit', value: SavingType.FIXED_DEPOSIT, icon: 'pi-lock' },
  { label: 'Other', value: SavingType.OTHER, icon: 'pi-ellipsis-h' }
];
