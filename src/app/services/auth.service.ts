import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { catchError, from, Observable, switchMap } from 'rxjs';
import { ToastService } from './toast.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private userSerice: UserService = inject(UserService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
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

      const exists = await this.storeUser(user);
      if (exists) {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/onboarding');
      }
    } catch (error) {
      console.error('Google login error', error);
      this.toastService.error('Error', `Google login error ${error}`);
    }
  }

  storeUser(user: User): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userSerice
        .getUserById(this.firestore, user.uid)
        .subscribe({
          next: userSnap => {
            if (!userSnap) {
              this.userSerice.setUserById(this.firestore, user.uid, user)
                .then(() => resolve(false))  // New user created
                .catch(reject);
            } else {
              resolve(true);  // User already exists
            }
          },
          error: reject
        });
    });
  }
}
