export interface Asset {
  id?: string;
  name: string;
  type: AssetType;
  amount: number;
  currency: string;
  institution?: string;
  note?: string;
  lastUpdated?: number;
}

export enum AssetType {
  CASH = 'Cash',
  BANK = 'Bank Account',
  INVESTMENT = 'Investment',
  CRYPTO = 'Crypto',
  GOLD = 'Gold',
  REAL_ESTATE = 'Real Estate',
  OTHER = 'Other'
}

export const ASSET_TYPE_OPTIONS = [
  { label: 'Cash', value: AssetType.CASH, icon: 'pi-wallet' },
  { label: 'Bank Account', value: AssetType.BANK, icon: 'pi-building' },
  { label: 'Investment', value: AssetType.INVESTMENT, icon: 'pi-chart-line' },
  { label: 'Crypto', value: AssetType.CRYPTO, icon: 'pi-bitcoin' },
  { label: 'Gold', value: AssetType.GOLD, icon: 'pi-star-fill' },
  { label: 'Real Estate', value: AssetType.REAL_ESTATE, icon: 'pi-home' },
  { label: 'Other', value: AssetType.OTHER, icon: 'pi-ellipsis-h' }
];
