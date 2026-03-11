import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  increment
} from '@angular/fire/firestore';
import { Balance } from '@models/balance.model';
import { Transaction, TransactionType } from '@models/transaction.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private commonService: CommonService = inject(CommonService);
  private incomes$ = new BehaviorSubject<Transaction[] | null>(null);
  private expenses$ = new BehaviorSubject<Transaction[] | null>(null);
  private balance$ = new BehaviorSubject<Balance | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private getTransactionsDocById(id: string): any {
    return collection(
      this.firebaseService.firestore,
      'user',
      id,
      'transactions'
    );
  }

  private getTransactionDocById(id: string, transactionID: string): any {
    return doc(
      this.firebaseService.firestore,
      'user',
      id,
      'transactions',
      transactionID
    );
  }

  private getMonthlyBalanceDocById(
    id: string,
    monthlyBalanceDocId: string
  ): any {
    return doc(
      this.firebaseService.firestore,
      'user',
      id,
      'monthlyBalances',
      monthlyBalanceDocId
    );
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getIncomes(): Observable<Transaction[] | null> {
    return this.incomes$.asObservable()!;
  }

  getExpenses(): Observable<Transaction[] | null> {
    return this.expenses$.asObservable()!;
  }

  getBalanceSnap(): Balance | null {
    return this.balance$.getValue();
  }

  getBalance(): Observable<Balance | null> {
    return this.balance$.asObservable()!;
  }

  /* Transactions */
  getTransactionsById(userId: string, type: TransactionType): Observable<any> {
    this.isLoading$.next(true);
    return defer(async () => {
      const querySnapshot = await getDocs(this.getTransactionsDocById(userId));
      const transactions = querySnapshot.docs
        .map((doc) => {
          const transaction = doc.data() as Transaction;
          return {
            id: doc.id,
            amount: transaction.amount,
            currency: transaction.currency,
            type: transaction.type,
            frequency: transaction.frequency,
            transactionType: transaction.transactionType,
            convertedAmount: transaction.convertedAmount,
            createdAt: transaction.createdAt
          };
        })
        .filter((t) => t.transactionType === type);
      if (type === 'Income') {
        this.incomes$.next(transactions);
      } else {
        this.expenses$.next(transactions);
      }
      this.isLoading$.next(false);
    });
  }

  createTransactionsById(
    userId: string,
    transaction: Transaction
  ): Observable<any> {
    return defer(async () => {
      const convertedAmount = await this.commonService.convertToVND(transaction.amount, transaction.currency.value);
      const transactionItem = {
        ...transaction,
        convertedAmount,
        createdAt: new Date(),
      } as Transaction;
      await addDoc(this.getTransactionsDocById(userId), transactionItem);
      this.updateMonthlyBalance(userId, transactionItem);
    });
  }

  updateTransactionsById(
    userId: string,
    transactionId: string,
    transaction: Transaction
  ): Observable<any> {
    return defer(async () => {
      await updateDoc(
        this.getTransactionDocById(userId, transactionId),
        transaction
      );
      this.updateMonthlyBalance(userId, transaction);
    });
  }

  deleteTransactionsById(
    userId: string,
    transactionId: string,
    transaction: Transaction
  ): Observable<any> {
    return defer(async () => {
      await deleteDoc(this.getTransactionDocById(userId, transactionId));
      this.updateMonthlyBalance(userId, transaction);
    });
  }

  /* Balance */
  getMonthlyBalanceByOffset(
    userId: string,
    monthOffset: number
  ): Observable<Balance> {
    return defer(async () => {
      const now = new Date();

      // Adjust date by month offset
      now.setMonth(now.getMonth() + monthOffset);

      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Convert from 0-based to 1-based month number

      const monthlyBalanceDocId = `${year}-${month.toString().padStart(2, '0')}`;
      const monthlyBalanceRef = this.getMonthlyBalanceDocById(
        userId,
        monthlyBalanceDocId
      );

      const docSnap = await getDoc(monthlyBalanceRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Balance;
        return data;
      }

      return {} as Balance;
    });
  }

  getMonthlyBalancesThisYear(userId: string): Observable<Balance[]> {
    return defer(async () => {
      const currentYear = new Date().getFullYear();
      const balancesRef = collection(this.firebaseService.firestore, `user/${userId}/monthlyBalances`);
      const q = query(balancesRef, where("year", "==", currentYear));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Balance,
      }));

      return results;
    });
  }

  private async updateMonthlyBalance(
    userId: string,
    transaction: Transaction
  ): Promise<void> {
    const date = transaction?.createdAt!; // or convert timestamp to JS Date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JS months 0-based
    const monthlyBalanceDocId = `${year}-${month.toString().padStart(2, '0')}`;

    const monthlyBalanceRef = this.getMonthlyBalanceDocById(
      userId,
      monthlyBalanceDocId
    );

    const incAmount = transaction.convertedAmount || 0;
    const isIncome = transaction.transactionType === 'Income';

    // Atomic update to avoid race conditions
    await setDoc(
      monthlyBalanceRef,
      {
        year,
        month,
        totalIncome: isIncome ? increment(incAmount) : increment(0),
        totalExpenses: !isIncome ? increment(incAmount) : increment(0),
        value: isIncome ? increment(incAmount) : increment(-incAmount),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  }

  percent2Months(current: number, previous: number): number {
    return previous === 0
      ? current === 0
        ? 0
        : 100
      : ((current - previous) / Math.abs(previous || 0)) * 100;
  }
}
