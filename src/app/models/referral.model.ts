export interface ReferralModel {
  id?: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'rewarded';
  createdAt: any;
  rewardAmount?: number;
  rewardCurrency?: string;
}

export interface UserReferralInfo {
  referralCode: string;
  totalReferrals: number;
  totalRewards: number;
  referralLink: string;
}
