import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private userSerice: UserService = inject(UserService);
  firestore: Firestore = inject(Firestore);
  user$: Observable<any>;
  constructor() {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(
      switchMap(() => this.user$),
      switchMap((user) =>
        this.userSerice.getUserById(this.firestore, user.uid)
      ),
      catchError((error) => {
        throw error;
      })
    );
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      localStorage.clear();
    });
    return from(promise);
  }

  signup(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((user) => {
      this.storeUser(user.user);
    }).catch((error) => {
      throw error;
    });
    return from(promise);
  }

  async googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;

      if (!user) {
        throw new Error('Google login error');
      }

      this.storeUser(user);
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }

  storeUser(user: User): void {
    this.userSerice
      .getUserById(this.firestore, user.uid)
      .subscribe(userSnap => {
        if (!userSnap.exists()) {
          this.userSerice.setUserById(this.firestore, user.uid, user);
        }
      });
  }
}
