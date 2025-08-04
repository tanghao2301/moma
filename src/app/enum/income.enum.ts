export const TYPE_INCOME_OPTIONS = [
  { value: 'salary', name: 'Salary', icon: 'pi pi-briefcase' },
  { value: 'business', name: 'Business', icon: 'pi pi-building' },
  { value: 'investments', name: 'Investments', icon: 'pi pi-chart-line' },
  { value: 'rental', name: 'Rental Income', icon: 'pi pi-home' },
  { value: 'pension', name: 'Pension', icon: 'pi pi-user' },
  { value: 'dividends', name: 'Dividends', icon: 'pi pi-dollar' },
  { value: 'royalties', name: 'Royalties', icon: 'pi pi-star' },
  { value: 'gov_support', name: 'Government Support', icon: 'pi pi-wallet' },
  { value: 'other', name: 'Other', icon: 'pi pi-ellipsis-h' },
];

export const CURRENCY_OPTIONS = [
  { label: 'Vietnamese Dong (VND)', value: 'VND', locale: 'vi-VN' },
  { label: 'US Dollar (USD)', value: 'USD', locale: 'en-US' }
];

export const FREQUENCY_OPTIONS = [
  { label: 'One-time', value: 'once', icon: 'pi-stop' },
  { label: 'Daily', value: 'daily', icon: 'pi-calendar-plus' },
  { label: 'Weekly', value: 'weekly', icon: 'pi-calendar' },
  { label: 'Monthly', value: 'monthly', icon: 'pi-calendar-times' },
  { label: 'Yearly', value: 'yearly', icon: 'pi-clock' },
];

export enum IncomeFrequency {
  OneTime = 'once',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'Yearly',
}
