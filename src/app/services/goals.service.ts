import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Goal } from '@models/goal.model';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private goals$ = new BehaviorSubject<Goal[] | null>(null);
  private isLoading$ = new BehaviorSubject<boolean>(false);

  private getGoalsCollection(userId: string) {
    return collection(
      this.firebaseService.firestore,
      'user',
      userId,
      'goals'
    );
  }

  private getGoalDoc(userId: string, goalId: string) {
    return doc(
      this.firebaseService.firestore,
      'user',
      userId,
      'goals',
      goalId
    );
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  getGoals(): Observable<Goal[] | null> {
    return this.goals$.asObservable();
  }

  fetchGoals(userId: string): Observable<Goal[]> {
    this.isLoading$.next(true);
    return defer(async () => {
      try {
        const querySnapshot = await getDocs(this.getGoalsCollection(userId));
        const goals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Goal),
        }));
        this.goals$.next(goals);
        return goals;
      } finally {
        this.isLoading$.next(false);
      }
    });
  }

  addGoal(userId: string, goal: Goal): Observable<any> {
    return defer(async () => {
      const docRef = await addDoc(this.getGoalsCollection(userId), {
        ...goal,
        lastUpdated: Date.now(),
      });
      await this.fetchGoals(userId).toPromise();
      return docRef;
    });
  }

  updateGoal(userId: string, goalId: string, goal: Partial<Goal>): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getGoalDoc(userId, goalId), {
        ...goal,
        lastUpdated: Date.now(),
      });
      await this.fetchGoals(userId).toPromise();
    });
  }

  deleteGoal(userId: string, goalId: string): Observable<any> {
    return defer(async () => {
      await deleteDoc(this.getGoalDoc(userId, goalId));
      await this.fetchGoals(userId).toPromise();
    });
  }
}
