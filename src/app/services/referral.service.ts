import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, where, setDoc } from '@angular/fire/firestore';
import { ReferralModel, UserReferralInfo } from '@models/referral.model';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private firestore: Firestore = inject(Firestore);

  getReferrals(userId: string): Observable<ReferralModel[]> {
    const referralsRef = collection(this.firestore, 'referrals');
    const q = query(referralsRef, where('referrerId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<ReferralModel[]>;
  }

  getUserReferralInfo(userId: string): Observable<UserReferralInfo> {
    // In a real app, the referral code might be stored in the user document
    // For this demo, we'll use a portion of the UID as the referral code
    const referralCode = userId.substring(0, 8).toUpperCase();
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

    return this.getReferrals(userId).pipe(
      map(referrals => {
        const totalReferrals = referrals.length;
        const totalRewards = referrals.reduce((acc, curr) => acc + (curr.rewardAmount || 0), 0);
        return {
          referralCode,
          totalReferrals,
          totalRewards,
          referralLink
        };
      })
    );
  }

  // Helper to simulate adding a referral (usually done during signup)
  addReferral(referrerId: string, referredUserId: string): Observable<void> {
    const referralId = `${referrerId}_${referredUserId}`;
    const referralRef = doc(this.firestore, 'referrals', referralId);
    const referral: ReferralModel = {
      referrerId,
      referredUserId,
      referralCode: referrerId.substring(0, 8).toUpperCase(),
      status: 'completed',
      createdAt: new Date(),
      rewardAmount: 50000, // Example reward: 50,000 VND
      rewardCurrency: 'VND'
    };
    return from(setDoc(referralRef, referral));
  }
}
