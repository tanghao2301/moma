import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Income } from '@models/income.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class IncomesService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private incomes$ = new BehaviorSubject<Income[] | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private getIncomesDocById(id: string): any {
    return collection(this.firebaseService.firestore, 'incomes', id, 'income');
  }

  private getIncomeDocById(id: string, incomeId: string): any {
    return doc(
      this.firebaseService.firestore,
      'incomes',
      id,
      'income',
      incomeId
    );
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getIncomesSnap(): Income[] | null {
    return this.incomes$.getValue();
  }

  getIncomes(): Observable<Income[] | null> {
    return this.incomes$.asObservable()!;
  }

  getIncomesById(userId: string): Observable<any> {
    this.isLoading$.next(true);
    return defer(async () => {
      const querySnapshot = await getDocs(this.getIncomesDocById(userId));
      const incomes = querySnapshot.docs.map((doc) => {
        const income = doc.data() as Income;
        return {
          id: doc.id,
          amount: income.amount,
          currency: income.currency,
          type: income.type,
          frequency: income.frequency
        };
      });
      this.incomes$.next(incomes);
      this.isLoading$.next(false);
    });
  }

  createIncomesById(userId: string, income: Income): Observable<any> {
    return defer(async () => {
      await addDoc(this.getIncomesDocById(userId), income);
    });
  }

  updateIncomesById(
    userId: string,
    incomeId: string,
    income: Income
  ): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getIncomeDocById(userId, incomeId), income);
    });
  }

  deleteIncomesById(userId: string, incomeId: string): Observable<any> {
    return defer(async () => {
      await deleteDoc(this.getIncomeDocById(userId, incomeId));
    });
  }
}
