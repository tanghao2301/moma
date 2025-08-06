import { inject, Injectable } from '@angular/core';
import {
  Auth,
  user
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import {
  browserSessionPersistence,
  setPersistence
} from 'firebase/auth';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseAuth: Auth = inject(Auth);
  firestore: Firestore = inject(Firestore);
  user$: Observable<any>;
  constructor() {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }
}
