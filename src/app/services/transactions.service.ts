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
} from '@angular/fire/firestore';
import { Balance } from '@models/balance.model';
import { Transaction, TransactionType } from '@models/transaction.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private transactions$ = new BehaviorSubject<Transaction[] | null>(null);
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

  getTransactionsSnap(): Transaction[] | null {
    return this.transactions$.getValue();
  }

  getTransactions(): Observable<Transaction[] | null> {
    return this.transactions$.asObservable()!;
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
          };
        })
        .filter((t) => t.transactionType === type);
      this.transactions$.next(transactions);
      this.isLoading$.next(false);
    });
  }

  createTransactionsById(
    userId: string,
    transaction: Transaction
  ): Observable<any> {
    return defer(async () => {
      await addDoc(this.getTransactionsDocById(userId), {
        ...transaction,
        createdAt: serverTimestamp(),
      });
      this.updateMonthlyBalance(userId, transaction);
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
  getTotalBalance(userId: string, transactionId: string): Observable<Balance> {
    return defer(async () => {
      const transactionsRef = this.getTransactionDocById(userId, transactionId);

      // Query income transactions
      const incomeQuery = query(transactionsRef, where('type', '==', 'income'));
      const incomeSnapshot = await getDocs(incomeQuery);

      let totalIncome = 0;
      incomeSnapshot.forEach((doc) => {
        const data = doc.data() as Transaction;
        totalIncome += data.amount || 0;
      });

      // Query expense transactions
      const expenseQuery = query(
        transactionsRef,
        where('type', '==', 'expense')
      );
      const expenseSnapshot = await getDocs(expenseQuery);

      let totalExpenses = 0;
      expenseSnapshot.forEach((doc) => {
        const data = doc.data() as Transaction;
        totalExpenses += data.amount || 0;
      }); 

      // Calculate balance
      const balance = totalIncome - totalExpenses;
      const totalBalance = { balance, totalIncome, totalExpenses };
      this.balance$.next(totalBalance)
      return totalBalance;
    });
  }

  private async updateMonthlyBalance(
    userId: string,
    transaction: Transaction
  ): Promise<void> {
    const date = transaction?.createdAt?.toDate()!; // or convert timestamp to JS Date
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
      totalIncome += transaction.amount;
    } else if (transaction.transactionType === 'Expenses') {
      totalExpenses += transaction.amount;
    }

    // 3. Save updated monthly balance doc
    await setDoc(
      monthlyBalanceRef,
      {
        year,
        month,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
