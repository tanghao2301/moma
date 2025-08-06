import { inject, Injectable } from '@angular/core';
import { doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserModel } from '@models/user.model';
import { User } from 'firebase/auth';
import { BehaviorSubject, defer, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firebaseService: FirebaseService = inject(FirebaseService);
  private user$ = new BehaviorSubject<UserModel | null>(null);

  getUserId(): string{
    return JSON.parse(localStorage.getItem('user')!)?.uid;
  }

  getUserDocById(id: string): any {
    return doc(this.firebaseService.firestore, 'user', id);
  }

  getUserSnap(): UserModel | null {
    return this.user$.getValue();
  }

  getUserById(id: string): Observable<any | null> {
    const userRef = this.getUserDocById(id);
    return defer(() =>
      getDoc(userRef).then((snap) => {
        const user = snap.exists() ? { uid: snap.id, ...(snap.data() ?? {}) } : null;
        this.user$.next(user);
        return user;
      })
    );
  }

  setUserById(id: string, userInfo: User | UserModel): Observable<any> {
    return defer(async () => {
      const user = {
        uid: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        photoURL: userInfo.photoURL,
      };
      await setDoc(this.getUserDocById(id), user);
      return user;
    });
  }

  updateUserById(id: string, userInfo: User | UserModel): Observable<any> {
    return defer(async () => {
      await updateDoc(this.getUserDocById(id), userInfo);
      return userInfo;
    });
  }
}
