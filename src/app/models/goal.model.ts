export interface Goal {
  id?: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: number; // timestamp
  icon?: string;
  color?: string;
  status: GoalStatus;
  lastUpdated?: number;
}

export enum GoalStatus {
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled'
}

export const GOAL_STATUS_OPTIONS = [
  { label: 'In Progress', value: GoalStatus.IN_PROGRESS, icon: 'pi-spinner' },
  { label: 'Completed', value: GoalStatus.COMPLETED, icon: 'pi-check-circle' },
  { label: 'On Hold', value: GoalStatus.ON_HOLD, icon: 'pi-pause' },
  { label: 'Cancelled', value: GoalStatus.CANCELLED, icon: 'pi-times-circle' }
];

export const GOAL_ICON_OPTIONS = [
  { label: 'Savings', value: 'pi-wallet' },
  { label: 'Home', value: 'pi-home' },
  { label: 'Car', value: 'pi-car' },
  { label: 'Travel', value: 'pi-map' },
  { label: 'Education', value: 'pi-graduation-cap' },
  { label: 'Emergency', value: 'pi-shield' },
  { label: 'Investment', value: 'pi-chart-line' },
  { label: 'Gift', value: 'pi-gift' },
  { label: 'Other', value: 'pi-ellipsis-h' }
];
