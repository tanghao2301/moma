import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { Saving } from '@models/saving.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class SavingsService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private savings$ = new BehaviorSubject<Saving[] | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private getSavingsCollection(userId: string) {
    return collection(
      this.firebaseService.firestore,
      'user',
      userId,
      'savings'
    );
  }

  private getSavingDoc(userId: string, savingId: string) {
    return doc(
      this.firebaseService.firestore,
      'user',
      userId,
      'savings',
      savingId
    );
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getSavings(): Observable<Saving[] | null> {
    return this.savings$.asObservable();
  }

  fetchSavings(userId: string): Observable<Saving[]> {
    this.isLoading$.next(true);
    return defer(async () => {
      try {
        const q = query(this.getSavingsCollection(userId), orderBy('lastUpdated', 'desc'));
        const querySnapshot = await getDocs(q);
        const savings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Saving),
        }));
        this.savings$.next(savings);
        return savings;
      } finally {
        this.isLoading$.next(false);
      }
    });
  }

  addSaving(userId: string, saving: Saving): Observable<any> {
    return defer(async () => {
      const docRef = await addDoc(this.getSavingsCollection(userId), {
        ...saving,
        lastUpdated: Date.now(),
      });
      await this.fetchSavings(userId).toPromise();
      return docRef;
    });
  }

  updateSaving(userId: string, savingId: string, saving: Partial<Saving>): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getSavingDoc(userId, savingId), {
        ...saving,
        lastUpdated: Date.now(),
      });
      await this.fetchSavings(userId).toPromise();
    });
  }

  deleteSaving(userId: string, savingId: string): Observable<any> {
    return defer(async () => {
      await deleteDoc(this.getSavingDoc(userId, savingId));
      await this.fetchSavings(userId).toPromise();
    });
  }
}
