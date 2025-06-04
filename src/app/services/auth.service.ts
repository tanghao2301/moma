import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore, setDoc } from '@angular/fire/firestore';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { catchError, from, Observable, of, switchMap, tap } from 'rxjs';
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
      tap((user) => {
        if (!user) return;
        localStorage.setItem(
          'user',
          JSON.stringify(user.providerData?.[0] || {})
        );
      }),
      catchError(() => of(null))
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
    ).then(() => {
      //
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

      this.userSerice
        .getUserById(this.firestore, user.uid)
        .subscribe(async (userSnap) => {
          if (!userSnap.exists()) {
            await setDoc(
              this.userSerice.getUserDocById(this.firestore, user.uid),
              {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
              }
            );
          }
        });
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }
}
