import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
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
            convertedAmount: transaction.convertedAmount
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

    // 1. Fetch existing monthly balance doc (if any)
    const docSnap = await getDoc(monthlyBalanceRef);
    let totalIncome = 0;
    let totalExpenses = 0;
    if (docSnap.exists()) {
      const data = docSnap.data() as Balance;
      totalIncome = data.totalIncome || 0;
      totalExpenses = data.totalExpenses || 0;
    }

    // 2. Update totals based on transaction type
    if (transaction.transactionType === 'Income') {
      totalIncome += transaction.convertedAmount;
    } else if (transaction.transactionType === 'Expense') {
      totalExpenses += transaction.convertedAmount;
    }

    // 3. Save updated monthly balance doc
    await setDoc(
      monthlyBalanceRef,
      {
        year,
        month,
        totalIncome,
        totalExpenses,
        value: totalIncome - totalExpenses,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
