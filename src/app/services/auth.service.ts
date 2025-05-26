import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
} from 'firebase/auth';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<any>;
  private firestore: Firestore = inject(Firestore);
  private firebaseAuth: Auth = inject(Auth);
  userCollection = collection(this.firestore, 'user');
  constructor() {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
      //
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }

  signup(email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {
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

      const userRef = doc(this.firestore, `user/${user.uid}`);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }
    } catch (error) {
      console.error('Google login error', error);
      throw error;
    }
  }
}
