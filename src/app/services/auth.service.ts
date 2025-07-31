import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import {
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { catchError, from, Observable, switchMap, take } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { ToastService } from './toast.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firebaseAuth: Auth = inject(Auth);
  private userService: UserService = inject(UserService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private firebaseService: FirebaseService = inject(FirebaseService);

  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password)
    ).pipe(
      switchMap(() => this.firebaseService.user$.pipe(take(1))),
      switchMap((user) =>
        this.userService.getUserById(user.uid)
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

  signup(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).catch((error) => {
      throw error;
    });
    return from(promise).pipe(switchMap((user) => this.storeUser(user.user)));
  }

  async googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.firebaseAuth, provider);
      const user = result.user;

      if (!user) {
        throw new Error('Google login error');
      }

      this.storeUser(user).subscribe({
        next: (userSnap) => {
          if (userSnap?.income || userSnap?.expenses) {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.router.navigateByUrl('/onboarding/personal-info');
          }
        },
      });
    } catch (error) {
      console.error('Google login error', error);
      this.toastService.error('Error', `Google login error ${error}`);
    }
  }

  private storeUser(user: User): Observable<any> {
    return new Observable((subscriber) => {
      this.userService.setUserById(user.uid, user).subscribe({
        next: (user) => subscriber.next(user),
        error: () => {
          subscriber.error();
        },
      });
    });
  }
}
