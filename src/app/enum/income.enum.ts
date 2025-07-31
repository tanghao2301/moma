export const TYPE_INCOME_OPTIONS = [
  { type: 'Salary', icon: 'pi-briefcase' },
  { type: 'Business', icon: 'pi-building' },
  { type: 'Investments', icon: 'pi-chart-line' },
  { type: 'Rental Income', icon: 'pi-home' },
  { type: 'Pension', icon: 'pi-user' },
  { type: 'Dividends', icon: 'pi-dollar' },
  { type: 'Royalties', icon: 'pi-star' },
  { type: 'Government Support', icon: 'pi-wallet' },
  { type: 'Other', icon: 'pi-ellipsis-h' },
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
