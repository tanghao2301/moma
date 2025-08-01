export const TYPE_INCOME_OPTIONS = [
  { name: 'Salary', icon: 'pi-briefcase' },
  { name: 'Business', icon: 'pi-building' },
  { name: 'Investments', icon: 'pi-chart-line' },
  { name: 'Rental Income', icon: 'pi-home' },
  { name: 'Pension', icon: 'pi-user' },
  { name: 'Dividends', icon: 'pi-dollar' },
  { name: 'Royalties', icon: 'pi-star' },
  { name: 'Government Support', icon: 'pi-wallet' },
  { name: 'Other', icon: 'pi-ellipsis-h' },
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
